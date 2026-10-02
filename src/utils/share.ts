import { TitipesanMessage } from '../types';

export function encodeMessageForShare(msg: TitipesanMessage): string {
  try {
    const payload = {
      id: msg.id,
      to: msg.to,
      message: msg.message,
      color: msg.color,
      song: msg.song ? {
        trackName: msg.song.trackName,
        artistName: msg.song.artistName,
        collectionName: msg.song.collectionName,
        artworkUrl100: msg.song.artworkUrl100,
        previewUrl: msg.song.previewUrl,
        trackViewUrl: msg.song.trackViewUrl,
      } : null,
      from: msg.from,
      date: msg.date,
      createdAt: msg.createdAt,
    };

    const json = JSON.stringify(payload);
    // Safe UTF-8 Base64 encoding
    const encoded = btoa(encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
    return encoded;
  } catch (err) {
    console.error('Failed to encode share link', err);
    return '';
  }
}

export function decodeMessageFromShare(hashOrQuery: string): TitipesanMessage | null {
  if (!hashOrQuery) return null;
  try {
    // Strip leading '#' or '?' or parameter prefixes if any
    let cleaned = hashOrQuery.trim();
    if (cleaned.startsWith('#')) cleaned = cleaned.slice(1);
    if (cleaned.startsWith('?')) cleaned = cleaned.slice(1);

    if (cleaned.includes('m=')) {
      const match = cleaned.match(/[?&#]m=([^&#]+)/);
      if (match) cleaned = match[1];
    } else if (cleaned.includes('=')) {
      const parts = cleaned.split('=');
      cleaned = parts[parts.length - 1];
    }

    if (cleaned.includes('#')) {
      const parts = cleaned.split('#');
      cleaned = parts[parts.length - 1];
    }

    cleaned = cleaned.trim();
    if (!cleaned) return null;

    // Safe UTF-8 Base64 decoding
    const decodedUri = atob(cleaned).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join('');
    const json = decodeURIComponent(decodedUri);
    const parsed = JSON.parse(json);

    if (!parsed || !parsed.to || !parsed.message) {
      return null;
    }

    return {
      id: parsed.id || 'shared-' + Date.now(),
      to: String(parsed.to),
      message: String(parsed.message),
      color: parsed.color || 'Warm Paper',
      song: parsed.song || null,
      from: parsed.from || 'AnonymousUser',
      date: parsed.date || 'Tersimpan',
      createdAt: parsed.createdAt || Date.now(),
    };
  } catch (err) {
    console.warn('Could not decode shared message', err);
    return null;
  }
}

export function buildShareUrl(msg: TitipesanMessage): string {
  const hash = encodeMessageForShare(msg);
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    const path = window.location.pathname === '/' ? '' : window.location.pathname;
    // By passing ?m=... the server can extract it for social meta preview (WhatsApp/Twitter/IG)
    return `${origin}${path}?m=${hash}#/detail#${hash}`;
  }
  return `?m=${hash}#/detail#${hash}`;
}

export function buildPersonalInboxUrl(recipientName: string): string {
  const safeName = encodeURIComponent(recipientName.trim());
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    const path = window.location.pathname === '/' ? '' : window.location.pathname;
    return `${origin}${path}#/create?to=${safeName}`;
  }
  return `#/create?to=${safeName}`;
}

export function generateSocialCopy(msg: TitipesanMessage): string {
  const url = buildShareUrl(msg);
  const snippet = msg.message.length > 90 ? msg.message.substring(0, 90) + '...' : msg.message;
  return `💌 Titipesan untuk ${msg.to}:\n“${snippet}”\n\nBaca surat lengkapnya di sini:\n${url}`;
}

// Generate Instagram Story Card Image (1080x1920) via HTML Canvas
export async function generateStoryCardImage(msg: TitipesanMessage): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve('');
      return;
    }

    // Background Warm Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 1080, 1920);
    bgGradient.addColorStop(0, '#1E1C1A');
    bgGradient.addColorStop(0.5, '#161514');
    bgGradient.addColorStop(1, '#0F0E0D');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1080, 1920);

    // Subtle ambient glow
    const radial = ctx.createRadialGradient(540, 960, 100, 540, 960, 800);
    radial.addColorStop(0, 'rgba(235, 225, 205, 0.08)');
    radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, 1080, 1920);

    // Top Brand Tag
    ctx.font = '500 36px "Space Mono", monospace';
    ctx.fillStyle = '#A39D91';
    ctx.textAlign = 'center';
    ctx.fillText('TITIPESAN.COM', 540, 220);

    ctx.font = 'italic 40px "Instrument Serif", Georgia, serif';
    ctx.fillStyle = '#6E695F';
    ctx.fillText('“Leave something worth remembering.”', 540, 280);

    // Paper Card Dimensions (centered)
    const cardX = 90;
    const cardY = 360;
    const cardW = 900;
    const cardH = 1180;
    const radius = 8;

    // Card Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 60;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 30;

    // Card Background (Paper)
    ctx.fillStyle = '#FCFAF4';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, radius);
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Card Border
    ctx.strokeStyle = '#EAE3D5';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Paper Top Line
    ctx.font = '500 28px "Space Mono", monospace';
    ctx.fillStyle = '#8C867C';
    ctx.textAlign = 'left';
    ctx.fillText('PESAN YANG DITITIPKAN', cardX + 70, cardY + 90);

    ctx.textAlign = 'right';
    ctx.fillText(msg.date, cardX + cardW - 70, cardY + 90);

    // Divider line
    ctx.strokeStyle = '#EAE3D5';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cardX + 70, cardY + 120);
    ctx.lineTo(cardX + cardW - 70, cardY + 120);
    ctx.stroke();

    // "UNTUK" Label
    ctx.font = '600 24px "Space Mono", monospace';
    ctx.fillStyle = '#8C867C';
    ctx.textAlign = 'left';
    ctx.fillText('UNTUK', cardX + 70, cardY + 190);

    // Recipient Name
    ctx.font = '600 68px "Instrument Serif", Georgia, serif';
    ctx.fillStyle = '#191817';
    ctx.fillText(msg.to, cardX + 70, cardY + 265);

    // Sender Alias (Right aligned)
    ctx.font = '500 24px "Space Mono", monospace';
    ctx.fillStyle = '#8C867C';
    ctx.textAlign = 'right';
    ctx.fillText('PENGIRIM', cardX + cardW - 70, cardY + 190);

    ctx.font = '600 32px "Space Mono", monospace';
    ctx.fillStyle = '#3D3830';
    ctx.fillText(msg.from, cardX + cardW - 70, cardY + 245);

    // Message Body (Handwritten wrapped text)
    ctx.font = '500 48px "Caveat", cursive, Georgia, serif';
    ctx.fillStyle = '#262320';
    ctx.textAlign = 'left';

    const words = `“${msg.message}”`.split(' ');
    let line = '';
    let currentY = cardY + 390;
    const maxWidth = cardW - 140;
    const lineHeight = 65;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, cardX + 70, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
        if (currentY > cardY + 880) {
          ctx.fillText(line + '...', cardX + 70, currentY);
          break;
        }
      } else {
        line = testLine;
      }
    }
    if (currentY <= cardY + 880) {
      ctx.fillText(line, cardX + 70, currentY);
    }

    // Music Badge (if present)
    if (msg.song) {
      const songBoxY = cardY + cardH - 240;
      ctx.fillStyle = 'rgba(25, 24, 23, 0.05)';
      ctx.strokeStyle = 'rgba(25, 24, 23, 0.1)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cardX + 70, songBoxY, cardW - 140, 95, 6);
      ctx.fill();
      ctx.stroke();

      ctx.font = '600 30px "Space Mono", monospace';
      ctx.fillStyle = '#191817';
      ctx.textAlign = 'left';
      ctx.fillText(`♫ ${msg.song.trackName}`, cardX + 110, songBoxY + 48);

      ctx.font = '400 24px "Space Mono", monospace';
      ctx.fillStyle = '#6E695F';
      ctx.fillText(msg.song.artistName, cardX + 110, songBoxY + 80);
    }

    // Card Footer Note
    ctx.font = '400 24px "Space Mono", monospace';
    ctx.fillStyle = '#9C968B';
    ctx.textAlign = 'center';
    ctx.fillText('Pesan anonim tanpa identitas asli · Titipesan', 540, cardY + cardH - 50);

    // Bottom Call to Action for Instagram Story viewers
    ctx.font = '500 34px "Space Mono", monospace';
    ctx.fillStyle = '#FAF7F0';
    ctx.textAlign = 'center';
    ctx.fillText('🔗 Buka link di stiker untuk membaca atau membalas', 540, 1680);

    ctx.font = '400 28px "Space Mono", monospace';
    ctx.fillStyle = '#8C8578';
    ctx.fillText('Kirim pesan anonimmu sendiri di titipesan.com', 540, 1740);

    resolve(canvas.toDataURL('image/png'));
  });
}
