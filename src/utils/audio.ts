type AudioListener = (state: {
  isPlaying: boolean;
  currentUrl: string | null;
  progress: number; // 0 to 1
  currentTime: number;
  duration: number;
}) => void;

class AudioManager {
  private static instance: AudioManager;
  private audio: HTMLAudioElement | null = null;
  private currentUrl: string | null = null;
  private listeners: Set<AudioListener> = new Set();
  private isPlaying = false;
  private progress = 0;
  private currentTime = 0;
  private duration = 30; // standard iTunes preview is 30s

  private constructor() {
    // Singleton
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    listener({
      isPlaying: this.isPlaying,
      currentUrl: this.currentUrl,
      progress: this.progress,
      currentTime: this.currentTime,
      duration: this.duration,
    });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const state = {
      isPlaying: this.isPlaying,
      currentUrl: this.currentUrl,
      progress: this.progress,
      currentTime: this.currentTime,
      duration: this.duration,
    };
    this.listeners.forEach((listener) => listener(state));
  }

  public playPreview(url: string) {
    if (!url) return;

    if (this.currentUrl === url && this.audio) {
      if (this.isPlaying) {
        this.pause();
        return;
      } else {
        this.audio.play().then(() => {
          this.isPlaying = true;
          this.notify();
        }).catch((err) => {
          console.warn('Autoplay blocked or playback interrupted:', err);
          this.isPlaying = false;
          this.notify();
        });
        return;
      }
    }

    // New audio track
    this.stopPreview();

    this.currentUrl = url;
    this.audio = new Audio(url);
    this.audio.preload = 'auto';

    this.audio.addEventListener('timeupdate', () => {
      if (!this.audio) return;
      this.currentTime = this.audio.currentTime;
      this.duration = this.audio.duration || 30;
      this.progress = this.duration > 0 ? this.currentTime / this.duration : 0;
      this.notify();
    });

    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.progress = 0;
      this.currentTime = 0;
      this.notify();
    });

    this.audio.addEventListener('error', (e) => {
      console.warn('Audio playback error:', e);
      this.isPlaying = false;
      this.notify();
    });

    this.audio.play().then(() => {
      this.isPlaying = true;
      this.notify();
    }).catch((err) => {
      console.warn('Autoplay prevented by browser:', err);
      this.isPlaying = false;
      this.notify();
    });
  }

  public togglePreview() {
    if (!this.audio) return;
    if (this.isPlaying) {
      this.pause();
    } else {
      this.audio.play().then(() => {
        this.isPlaying = true;
        this.notify();
      }).catch(() => {
        this.isPlaying = false;
        this.notify();
      });
    }
  }

  public pause() {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
      this.notify();
    }
  }

  public stopPreview() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
    this.isPlaying = false;
    this.currentUrl = null;
    this.progress = 0;
    this.currentTime = 0;
    this.notify();
  }

  public getState() {
    return {
      isPlaying: this.isPlaying,
      currentUrl: this.currentUrl,
      progress: this.progress,
      currentTime: this.currentTime,
      duration: this.duration,
    };
  }
}

export const audioManager = AudioManager.getInstance();
