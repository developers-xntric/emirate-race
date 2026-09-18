import type { Metadata } from 'next';
import RacePage from '@/component/races/RacePage';
import { alShuwaib } from '@/data/races/al-shuwaib';
export const metadata: Metadata = { title: 'Al Shuwaib Race | Emirates Villages Run Series 2026', description: 'Explore the family, community and competitive routes for the final EVRS 2026 race in Al Shuwaib, Abu Dhabi.' };
export default function AlShuwaibPage() { return <RacePage race={alShuwaib} />; }