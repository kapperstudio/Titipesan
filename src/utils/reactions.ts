export interface MessageReactions {
  hug: number;    // 🤍 Titip Peluk
  touch: number;  // ✨ Tersentuh
  pray: number;   // 🕊️ Kirim Doa
  userReacted?: {
    hug?: boolean;
    touch?: boolean;
    pray?: boolean;
  };
}

const STORAGE_KEY = 'titipesan_reactions_v1';

// Initial seed baseline counts so cards feel active and communal
const INITIAL_REACTIONS: Record<string, { hug: number; touch: number; pray: number }> = {
  'tp-seed-01': { hug: 42, touch: 67, pray: 19 },
  'tp-seed-02': { hug: 58, touch: 83, pray: 31 },
  'tp-seed-03': { hug: 35, touch: 92, pray: 44 },
  'tp-seed-04': { hug: 71, touch: 54, pray: 26 },
};

export function getMessageReactions(messageId: string): MessageReactions {
  if (typeof window === 'undefined') {
    return { hug: 0, touch: 0, pray: 0 };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const store: Record<string, MessageReactions> = raw ? JSON.parse(raw) : {};

    if (store[messageId]) {
      return store[messageId];
    }

    const initial = INITIAL_REACTIONS[messageId] || {
      hug: Math.floor(5 + Math.random() * 20),
      touch: Math.floor(10 + Math.random() * 30),
      pray: Math.floor(3 + Math.random() * 15),
    };

    const newObj: MessageReactions = {
      ...initial,
      userReacted: {},
    };

    store[messageId] = newObj;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    return newObj;
  } catch {
    return { hug: 0, touch: 0, pray: 0 };
  }
}

export function toggleReaction(
  messageId: string,
  type: 'hug' | 'touch' | 'pray'
): MessageReactions {
  if (typeof window === 'undefined') {
    return { hug: 0, touch: 0, pray: 0 };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const store: Record<string, MessageReactions> = raw ? JSON.parse(raw) : {};
    const current = store[messageId] || getMessageReactions(messageId);
    const userReacted = current.userReacted || {};

    const alreadyReacted = userReacted[type];
    if (alreadyReacted) {
      current[type] = Math.max(0, current[type] - 1);
      userReacted[type] = false;
    } else {
      current[type] = (current[type] || 0) + 1;
      userReacted[type] = true;
    }

    current.userReacted = userReacted;
    store[messageId] = current;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    return { ...current };
  } catch {
    return { hug: 0, touch: 0, pray: 0 };
  }
}
