import { useState, useEffect } from 'react';
import { AppRoute, TitipesanMessage } from './types';
import { getStoredMessages } from './utils/storage';
import { decodeMessageFromShare } from './utils/share';
import { audioManager } from './utils/audio';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DetailModal } from './components/DetailModal';
import { CopyBottomSheet } from './components/CopyBottomSheet';
import { StoryCardModal } from './components/StoryCardModal';
import { FloatingAudioBar } from './components/FloatingAudioBar';
import { MobileDock } from './components/MobileDock';
import { Toast } from './components/Toast';

import { HomePage } from './pages/HomePage';
import { CreatePage } from './pages/CreatePage';
import { SearchPage } from './pages/SearchPage';
import { HistoryPage } from './pages/HistoryPage';
import { DonatePage } from './pages/DonatePage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { SupportPage } from './pages/SupportPage';
import { DetailPage } from './pages/DetailPage';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('/');
  const [messages, setMessages] = useState<TitipesanMessage[]>([]);
  const [activeModalMessage, setActiveModalMessage] = useState<TitipesanMessage | null>(null);
  const [shareSheetMessage, setShareSheetMessage] = useState<TitipesanMessage | null>(null);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const [storyModalMessage, setStoryModalMessage] = useState<TitipesanMessage | null>(null);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sharedRouteMessage, setSharedRouteMessage] = useState<TitipesanMessage | null>(null);

  // Load stored messages once on mount
  useEffect(() => {
    const loaded = getStoredMessages();
    setMessages(loaded);
  }, []);

  // Parse location hash / URL routing
  const parseCurrentLocation = () => {
    const hash = window.location.hash;
    const pathname = window.location.pathname;
    const search = window.location.search;

    // Check if ?m=... is present in search query
    if (search && search.includes('m=')) {
      const decoded = decodeMessageFromShare(search);
      if (decoded) {
        setSharedRouteMessage(decoded);
        setCurrentRoute('/detail');
        return;
      }
    }

    // Check if there is an encoded shared message in hash
    if (hash && (hash.includes('/detail#') || hash.startsWith('#detail') || hash.length > 30)) {
      const decoded = decodeMessageFromShare(hash);
      if (decoded) {
        setSharedRouteMessage(decoded);
        setCurrentRoute('/detail');
        return;
      }
    }

    // Check if hash has route with parameters like #/create?to=...
    if (hash.startsWith('#/create') || hash.startsWith('#create')) {
      setCurrentRoute('/create');
      return;
    }

    // Check normal hash routing e.g. #/search, #/create, #/history
    if (hash.startsWith('#/')) {
      const routePart = hash.slice(1).split('?')[0].split('#')[0] as AppRoute;
      const validRoutes: AppRoute[] = [
        '/',
        '/create',
        '/search',
        '/history',
        '/donate',
        '/about',
        '/privacy',
        '/support',
        '/detail',
      ];
      if (validRoutes.includes(routePart)) {
        setCurrentRoute(routePart);
        return;
      }
    }

    // Pathname fallback
    if (pathname === '/create') setCurrentRoute('/create');
    else if (pathname === '/search') setCurrentRoute('/search');
    else if (pathname === '/history') setCurrentRoute('/history');
    else if (pathname === '/donate') setCurrentRoute('/donate');
    else if (pathname === '/about') setCurrentRoute('/about');
    else if (pathname === '/privacy') setCurrentRoute('/privacy');
    else if (pathname === '/support') setCurrentRoute('/support');
    else if (pathname === '/detail') setCurrentRoute('/detail');
    else setCurrentRoute('/');
  };

  useEffect(() => {
    parseCurrentLocation();

    const handleLocationChange = () => {
      parseCurrentLocation();
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleNavigate = (route: AppRoute) => {
    setActiveModalMessage(null);
    setCurrentRoute(route);

    if (route === '/') {
      window.history.pushState(null, '', window.location.pathname);
    } else {
      window.history.pushState(null, '', `#${route}`);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleMessageCreated = (newMsg: TitipesanMessage) => {
    setMessages((prev) => [newMsg, ...prev]);
    showToast('Pesan berhasil dititipkan.');
    setActiveModalMessage(newMsg);
    handleNavigate('/search');
  };

  const handleOpenDetailModal = (msg: TitipesanMessage) => {
    setActiveModalMessage(msg);
  };

  const handleCloseDetailModal = () => {
    setActiveModalMessage(null);
  };

  const handleOpenShareSheet = (msg: TitipesanMessage) => {
    setShareSheetMessage(msg);
    setIsShareSheetOpen(true);
  };

  const handleCloseShareSheet = () => {
    setIsShareSheetOpen(false);
  };

  const handleOpenStoryModal = (msg: TitipesanMessage) => {
    setStoryModalMessage(msg);
    setIsStoryModalOpen(true);
  };

  const handleCloseStoryModal = () => {
    setIsStoryModalOpen(false);
  };

  const handleOpenRandomMessage = () => {
    if (messages.length === 0) return;
    const randomIdx = Math.floor(Math.random() * messages.length);
    const chosen = messages[randomIdx];
    setActiveModalMessage(chosen);
    showToast(`Membuka surat untuk ${chosen.to}...`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#191817] pb-16 md:pb-0">
      {/* Editorial Navigation */}
      <Navbar currentRoute={currentRoute} onNavigate={handleNavigate} />

      {/* Main Page Content */}
      <main className="flex-1 w-full">
        {currentRoute === '/' && (
          <HomePage
            messages={messages}
            onNavigate={handleNavigate}
            onOpenDetail={handleOpenDetailModal}
            onOpenRandom={handleOpenRandomMessage}
            onShowToast={showToast}
          />
        )}

        {currentRoute === '/create' && (
          <CreatePage
            onMessageCreated={handleMessageCreated}
            onNavigate={handleNavigate}
          />
        )}

        {currentRoute === '/search' && (
          <SearchPage
            messages={messages}
            onOpenDetail={handleOpenDetailModal}
          />
        )}

        {currentRoute === '/history' && (
          <HistoryPage
            messages={messages}
            onNavigate={handleNavigate}
            onOpenDetail={handleOpenDetailModal}
          />
        )}

        {currentRoute === '/donate' && <DonatePage />}

        {currentRoute === '/about' && <AboutPage />}

        {currentRoute === '/privacy' && <PrivacyPage />}

        {currentRoute === '/support' && <SupportPage />}

        {currentRoute === '/detail' && (
          <DetailPage
            message={sharedRouteMessage || activeModalMessage || messages[0] || null}
            onNavigate={handleNavigate}
            onOpenShareSheet={handleOpenShareSheet}
            onOpenStoryModal={handleOpenStoryModal}
          />
        )}
      </main>

      {/* Editorial Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Fullscreen Message Detail Modal */}
      <DetailModal
        message={activeModalMessage}
        onClose={handleCloseDetailModal}
        onOpenShareSheet={handleOpenShareSheet}
        onOpenStoryModal={handleOpenStoryModal}
      />

      {/* Copy Link Bottom Sheet */}
      <CopyBottomSheet
        message={shareSheetMessage}
        isOpen={isShareSheetOpen}
        onClose={handleCloseShareSheet}
        onShowToast={showToast}
        onOpenStoryModal={handleOpenStoryModal}
      />

      {/* Instagram Story / Status Card Modal */}
      <StoryCardModal
        message={storyModalMessage}
        isOpen={isStoryModalOpen}
        onClose={handleCloseStoryModal}
        onShowToast={showToast}
      />

      {/* Persistent Floating Audio Bar for playing songs while browsing notes */}
      <FloatingAudioBar
        currentMessage={activeModalMessage || sharedRouteMessage || messages[0] || null}
        onOpenMessage={handleOpenDetailModal}
      />

      {/* Mobile Bottom Dock (Thumb Navigation) */}
      <MobileDock
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onOpenRandom={handleOpenRandomMessage}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}
