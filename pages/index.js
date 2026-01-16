import { useApp } from '@/contexts/AppContext';
import { PAGES } from '@/lib/constants/pages';
import PowerScreen from '@/components/power/PowerScreen';
import MainLayout from '@/components/layout/MainLayout';
import HomePage from '@/components/pages/HomePage';
import FilmsPage from '@/components/pages/FilmsPage';
import VideoEditsPage from '@/components/pages/VideoEditsPage';
import LinksPage from '@/components/pages/LinksPage';
// import LoremakerPage from '@/components/pages/LoremakerPage';
import PhotographyPage from '@/components/pages/PhotographyPage';
import AIAlbumsPage from '@/components/pages/AIAlbumsPage';
import BlogPage from '@/components/pages/BlogPage';

export default function Home() {
  const { isPoweredOn, currentPage } = useApp();

  if (!isPoweredOn) {
    return <PowerScreen />;
  }

  // Render the current page
  const renderPage = () => {
    switch (currentPage) {
      case PAGES.HOME:
        return <HomePage />;
      case PAGES.FILMS:
        return <FilmsPage />;
      case PAGES.VIDEO_EDITS:
        return <VideoEditsPage />;
      case PAGES.LINKS:
        return <LinksPage />;
      case PAGES.PHOTOGRAPHY:
        return <PhotographyPage />;
      case PAGES.AI_ALBUMS:
        return <AIAlbumsPage />;
      case PAGES.BLOG:
        return <BlogPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <MainLayout>
      {renderPage()}
    </MainLayout>
  );
}
