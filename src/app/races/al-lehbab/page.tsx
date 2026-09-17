import type { Metadata } from 'next';
import RacePage from '@/component/races/RacePage';
import { alLehbab } from '@/data/races/al-lehbab';

export const metadata: Metadata = {
  title: 'Al Lehbab Race | Emirates Villages Run Series 2026',
  description: 'Run beyond the city in Al Lehbab, Dubai. Explore the family, community and competitive routes for race two of EVRS 2026.',
};
export default function AlLehbabPage() {
  return <RacePage race={alLehbab} />;
}
