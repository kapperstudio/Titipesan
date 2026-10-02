import { TitipesanMessage } from '../types';

const STORAGE_KEY = 'titipesan';
const SEED_FLAG_KEY = 'titipesan_seeded_v1';
const USER_CREATED_IDS_KEY = 'titipesan_my_ids';

export function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function escapeAttr(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const INITIAL_SEEDS: TitipesanMessage[] = [
  {
    id: 'tp-seed-01',
    to: 'Rania',
    message: 'Mungkin kita tidak akan pernah bertemu lagi di sudut kafe itu, tapi terima kasih untuk obrolan sore di bawah hujan yang tidak pernah selesai. Semoga kotamu selalu ramah padamu.',
    color: 'Warm Paper',
    from: 'QuietMoon482913',
    date: '01 Okt 2026',
    createdAt: 1790800000000,
    song: {
      trackName: 'Monokrom',
      artistName: 'Tulus',
      collectionName: 'Monokrom',
      artworkUrl100: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/bf/f9/ba/bff9ba59-7157-195b-aaee-4cb788ecab17/cover.jpg/200x200bb.jpg',
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/4a/c3/81/4ac38150-fe98-8ec1-3d77-ffcbe9e034ca/mzaf_10300624867493863486.plus.aac.p.m4a',
      trackViewUrl: 'https://music.apple.com/id/album/monokrom/1140060934?i=1140061327',
    },
  },
  {
    id: 'tp-seed-02',
    to: 'Bagas & Teman-teman',
    message: 'Selamat sudah sampai di titik ini. Aku tahu betapa beratnya hari-hari kemarin. Bangga melihatmu melangkah sejauh ini meski tanpa tepuk tangan orang lain.',
    color: 'Sage',
    from: 'SilentRiver839201',
    date: '28 Sep 2026',
    createdAt: 1790500000000,
    song: {
      trackName: 'Rehat',
      artistName: 'Kunto Aji',
      collectionName: 'Mantra Mantra',
      artworkUrl100: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b8/df/65/b8df6581-fe42-2d17-91f8-08ca1b9ff692/cover.jpg/200x200bb.jpg',
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/7e/c9/28/7ec928f2-53b6-ae3a-4efb-fbcf3bf131bc/mzaf_16886369165215777610.plus.aac.p.m4a',
      trackViewUrl: 'https://music.apple.com/id/album/rehat/1435889396?i=1435889656',
    },
  },
  {
    id: 'tp-seed-03',
    to: 'Ayah',
    message: 'Terima kasih sudah selalu diam-diam memastikan lampu teras menyala setiap aku pulang larut. Maaf aku jarang mengatakannya langsung saat kita minum kopi di meja makan.',
    color: 'Cream',
    from: 'AmberLantern102944',
    date: '24 Sep 2026',
    createdAt: 1790200000000,
    song: {
      trackName: 'Yang Patah Tumbuh, Yang Hilang Berganti',
      artistName: 'Banda Neira',
      collectionName: 'Yang Patah Tumbuh, Yang Hilang Berganti',
      artworkUrl100: 'https://is1-ssl.mzstatic.com/image/thumb/Music69/v4/5a/8a/a0/5a8aa0ec-c49b-7300-804b-3d607df2f5ee/cover.jpg/200x200bb.jpg',
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/21/df/b6/21dfb689-53e3-7ce6-a7ee-0017bfb428d0/mzaf_6563606625841641320.plus.aac.p.m4a',
      trackViewUrl: 'https://music.apple.com/id/album/yang-patah-tumbuh-yang-hilang-berganti/1077750174?i=1077750186',
    },
  },
  {
    id: 'tp-seed-04',
    to: 'Untuk diriku 5 tahun lalu',
    message: 'Semua ketakutanmu tentang masa depan tidak akan membunuhmu. Kamu akan belajar tertawa lagi, dan kamu akan menemukan orang-orang serta lagu-lagu yang membuatmu ingin bangun esok pagi.',
    color: 'Lavender',
    from: 'GentleDawn592817',
    date: '19 Sep 2026',
    createdAt: 1789800000000,
    song: {
      trackName: 'Runtuh',
      artistName: 'Feby Putri & Fiersa Besari',
      collectionName: 'Runtuh - Single',
      artworkUrl100: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b4/0f/50/b40f500e-6f81-583c-1b65-442e97ea2c2b/cover.jpg/200x200bb.jpg',
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/cf/30/84/cf308474-325d-24ec-a3aa-b2b54bc3e809/mzaf_10526768393529346513.plus.aac.p.m4a',
      trackViewUrl: 'https://music.apple.com/id/album/runtuh/1586524907?i=1586524911',
    },
  },
];

export function getStoredMessages(): TitipesanMessage[] {
  if (typeof window === 'undefined') return INITIAL_SEEDS;

  try {
    const isSeeded = localStorage.getItem(SEED_FLAG_KEY);
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!isSeeded || !raw) {
      // Seed once!
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEEDS));
      localStorage.setItem(SEED_FLAG_KEY, 'true');
      return INITIAL_SEEDS;
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_SEEDS;
  } catch (e) {
    console.warn('Error accessing localStorage for titipesan', e);
    return INITIAL_SEEDS;
  }
}

export function saveNewMessage(msg: TitipesanMessage): void {
  if (typeof window === 'undefined') return;

  try {
    const current = getStoredMessages();
    // Prepend new message
    const updated = [msg, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Also track created IDs for history
    const userIdsRaw = localStorage.getItem(USER_CREATED_IDS_KEY);
    const userIds: string[] = userIdsRaw ? JSON.parse(userIdsRaw) : [];
    if (!userIds.includes(msg.id)) {
      userIds.unshift(msg.id);
      localStorage.setItem(USER_CREATED_IDS_KEY, JSON.stringify(userIds));
    }
  } catch (e) {
    console.error('Failed to save message to localStorage', e);
  }
}

export function getMyMessageIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USER_CREATED_IDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getExistingAliases(): string[] {
  const msgs = getStoredMessages();
  return msgs.map((m) => m.from).filter(Boolean);
}
