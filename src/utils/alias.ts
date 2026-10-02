const ADJECTIVES = [
  'Quiet', 'Gentle', 'Silent', 'Distant', 'Serene', 'Amber', 'Velvet',
  'Autumn', 'Midnight', 'Whispering', 'Hollow', 'Solitary', 'Golden',
  'Muted', 'Lapis', 'Wandering', 'Tender', 'Pensive', 'Humble', 'Echoing',
  'Lunar', 'Solar', 'Mist', 'Kind', 'Still', 'Secret', 'Patient', 'Drifting'
];

const NOUNS = [
  'Moon', 'River', 'Breeze', 'Letter', 'Shadow', 'Orchid', 'Horizon',
  'Lantern', 'Memory', 'Echo', 'Petal', 'Shore', 'Dawn', 'Dusk',
  'Clover', 'Sparrow', 'Rain', 'Canopy', 'Starlight', 'Pebble', 'Haven',
  'Compass', 'Feather', 'Silence', 'Willow', 'Tide', 'Loom'
];

const ALIAS_STORAGE_KEY = 'titipesan_alias';

function generateRandomAlias(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(100000 + Math.random() * 900000);
  return `${adj}${noun}${num}`;
}

export function getBrowserAlias(existingAliases: string[] = []): string {
  if (typeof window === 'undefined') return 'QuietMoon482913';

  try {
    let stored = localStorage.getItem(ALIAS_STORAGE_KEY);
    if (stored && stored.trim() !== '') {
      return stored.trim();
    }

    let attempts = 0;
    let candidate = generateRandomAlias();
    while (existingAliases.includes(candidate) && attempts < 50) {
      candidate = generateRandomAlias();
      attempts++;
    }

    localStorage.setItem(ALIAS_STORAGE_KEY, candidate);
    return candidate;
  } catch {
    return generateRandomAlias();
  }
}
