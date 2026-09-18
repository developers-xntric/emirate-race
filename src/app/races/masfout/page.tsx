import type { Metadata } from 'next';
import RacePage from '@/component/races/RacePage';
import { masfout } from '@/data/races/masfout';
export const metadata: Metadata = { title: 'Masfout Race | Emirates Villages Run Series 2026', description: 'Explore the family, community and competitive routes for EVRS race five in Masfout, Ajman.' };
export default function MasfoutPage() { return <RacePage race={masfout} />; }