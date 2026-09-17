import type { Metadata } from 'next';
import RacePage from '@/component/races/RacePage';
import { qidfa } from '@/data/races/qidfa';

export const metadata: Metadata = {
  title: 'Qidfa Race | Emirates Villages Run Series 2026',
  description: 'Discover the Qidfa race in Fujairah. Explore the 1.5km, 5km and 10km routes and join the first race of EVRS 2026.',
};
export default function QidfaPage() {
  return <RacePage race={qidfa} />;
}
