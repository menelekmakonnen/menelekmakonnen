import { useApp } from '@/contexts/AppContext';
import PowerScreen from '@/components/power/PowerScreen';
import MainLayout from '@/components/layout/MainLayout';
import HomePage from '@/components/pages/HomePage';

export default function Home() {
  const { isPoweredOn } = useApp();

  if (!isPoweredOn) {
    return <PowerScreen />;
  }

  return (
    <MainLayout>
      <HomePage />
    </MainLayout>
  );
}
