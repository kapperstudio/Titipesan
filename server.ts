import express, { Request, Response } from 'express';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 3000;

// Helper to sanitize XML / HTML attributes
function escapeXml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Decode UTF-8 Base64 payload safely
function decodeMessagePayload(payloadStr: string) {
  try {
    let cleaned = payloadStr.trim();
    if (cleaned.startsWith('#')) cleaned = cleaned.slice(1);
    if (cleaned.includes('=')) {
      const parts = cleaned.split('=');
      cleaned = parts[parts.length - 1];
    }
    const decodedUri = Buffer.from(cleaned, 'base64').toString('binary');
    const json = decodeURIComponent(
      decodedUri
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// Dynamic OpenGraph Image (SVG with high-res styling)
app.get('/api/og-image', (req: Request, res: Response) => {
  const to = (req.query.to as string) || 'Seseorang';
  const from = (req.query.from as string) || 'Anonim';
  const song = (req.query.song as string) || '';
  const message = (req.query.m as string) || 'Titipkan sesuatu yang ingin diingat.';

  // Truncate message for SVG card display
  const truncated =
    message.length > 130 ? message.substring(0, 130) + '...' : message;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FBF9F5" />
        <stop offset="100%" stop-color="#F3EFE6" />
      </linearGradient>
      <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
        <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#191817" flood-opacity="0.12"/>
      </filter>
    </defs>

    <!-- Canvas Background -->
    <rect width="1200" height="630" fill="url(#bg)" />

    <!-- Paper Note in Center -->
    <g transform="translate(150, 65)">
      <rect width="900" height="500" rx="4" fill="#FCFAF4" stroke="#EAE3D5" stroke-width="2" filter="url(#shadow)" />

      <!-- Top Header -->
      <text x="50" y="55" font-family="Space Mono, monospace" font-size="16" fill="#8C867C" letter-spacing="2">
        TITIPESAN / ARSIP SURAT ANONIM
      </text>
      <line x1="50" y1="75" x2="850" y2="75" stroke="#EAE3D5" stroke-width="1.5" />

      <!-- To / Recipient -->
      <text x="50" y="125" font-family="Space Mono, monospace" font-size="14" fill="#8C867C" letter-spacing="1">UNTUK</text>
      <text x="50" y="165" font-family="Instrument Serif, Georgia, serif" font-size="42" font-weight="600" fill="#191817">
        ${escapeXml(to)}
      </text>

      <!-- Message Text -->
      <foreignObject x="50" y="195" width="800" height="180">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Caveat, cursive, Georgia, serif; font-size: 32px; line-height: 1.45; color: #262320; word-break: break-word;">
          “${escapeXml(truncated)}”
        </div>
      </foreignObject>

      ${
        song
          ? `
        <!-- Song Badge -->
        <rect x="50" y="390" width="460" height="42" rx="3" fill="#191817" fill-opacity="0.04" stroke="#191817" stroke-opacity="0.08" />
        <text x="70" y="416" font-family="Space Mono, monospace" font-size="13" fill="#47433C">
          ♫ ${escapeXml(song)}
        </text>
      `
          : ''
      }

      <!-- Bottom Metadata -->
      <line x1="50" y1="445" x2="850" y2="445" stroke="#EAE3D5" stroke-width="1.5" />
      <text x="50" y="475" font-family="Space Mono, monospace" font-size="13" fill="#7D786F">
        Oleh ${escapeXml(from)} · Pesan Rahasia
      </text>
      <text x="850" y="475" text-anchor="end" font-family="Space Mono, monospace" font-size="13" fill="#7D786F">
        titipesan.com
      </text>
    </g>
  </svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.send(svg);
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  let vite: ViteDevServer | null = null;

  if (!isProd) {
    vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist'), { index: false }));
  }

  // Intercept all HTML requests to inject dynamic OpenGraph tags if a note is requested
  app.use('*', async (req: Request, res: Response) => {
    try {
      const url = req.originalUrl;
      let rawHtml = '';

      if (!isProd && vite) {
        const indexPath = path.resolve(__dirname, 'index.html');
        rawHtml = fs.readFileSync(indexPath, 'utf-8');
        rawHtml = await vite.transformIndexHtml(url, rawHtml);
      } else {
        const distIndexPath = path.resolve(__dirname, 'dist', 'index.html');
        if (fs.existsSync(distIndexPath)) {
          rawHtml = fs.readFileSync(distIndexPath, 'utf-8');
        } else {
          rawHtml = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        }
      }

      // Check query params or hash encoded in url
      const queryParamM = (req.query.m as string) || (req.query.msg as string);
      let noteData = null;

      if (queryParamM) {
        noteData = decodeMessagePayload(queryParamM);
      }

      // If we have note data, customize meta tags for social media link preview (WhatsApp, Twitter, IG, etc.)
      if (noteData && noteData.to && noteData.message) {
        const to = escapeXml(noteData.to);
        const from = escapeXml(noteData.from || 'Anonim');
        const songName = noteData.song?.trackName
          ? `${noteData.song.trackName} - ${noteData.song.artistName}`
          : '';
        const rawMsg = noteData.message;
        const msgSnippet = escapeXml(
          rawMsg.length > 120 ? rawMsg.substring(0, 120) + '...' : rawMsg
        );

        const pageTitle = `Pesan untuk ${to} — Titipesan`;
        const pageDesc = `“${msgSnippet}” — Dititipkan oleh ${from} di Titipesan. Baca pesan lengkapnya.`;
        const appUrl = process.env.APP_URL || `http://${req.headers.host}`;
        const ogImageUrl = `${appUrl}/api/og-image?to=${encodeURIComponent(
          noteData.to
        )}&from=${encodeURIComponent(from)}&song=${encodeURIComponent(
          songName
        )}&m=${encodeURIComponent(rawMsg.substring(0, 130))}`;

        // Replace meta tags in HTML
        let replacedHtml = rawHtml
          .replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`)
          .replace(
            /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
            `<meta name="description" content="${pageDesc}" />`
          )
          .replace(
            /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
            `<meta property="og:title" content="${pageTitle}" />`
          )
          .replace(
            /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
            `<meta property="og:description" content="${pageDesc}" />`
          )
          .replace(
            /<meta\s+property="og:type"\s+content=".*?"\s*\/?>/i,
            `<meta property="og:type" content="article" />\n    <meta property="og:image" content="${ogImageUrl}" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n    <meta name="twitter:image" content="${ogImageUrl}" />\n    <meta name="twitter:title" content="${pageTitle}" />\n    <meta name="twitter:description" content="${pageDesc}" />`
          );

        res.status(200).set({ 'Content-Type': 'text/html' }).send(replacedHtml);
        return;
      }

      res.status(200).set({ 'Content-Type': 'text/html' }).send(rawHtml);
    } catch (e: any) {
      if (vite) vite.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.message);
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Titipesan server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
