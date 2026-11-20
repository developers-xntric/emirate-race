import SiteLayout from "../(site)/layout";

// The public race routes remain outside the site group because their folder
// was held open by the local dev server. This is still a root layout, so it
// owns the only html/body shell for every /races route.
export default function RacesLayout({ children }: { children: React.ReactNode }) {
  return <SiteLayout>{children}</SiteLayout>;
}