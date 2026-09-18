import { qidfa } from "@/data/races/qidfa";
import { alLehbab } from "@/data/races/al-lehbab";
import { wadiAlHelo } from "@/data/races/wadi-al-helo";
import { falajAlMualla } from "@/data/races/falaj-al-mualla";
import { masfout } from "@/data/races/masfout";
import { alRams } from "@/data/races/al-rams";
import { alShuwaib } from "@/data/races/al-shuwaib";

export const challenges = [
  { distance: "10KM", title: "Competitive Run", color: "#706cb5", image: "/about/distance-10km.png", description: "The flagship EVRS challenge for experienced runners and anyone ready to push their pace across a unique village route. A timed race designed for those chasing a personal best, competing for position or simply looking to test themselves over the full 10KM distance." },
  { distance: "5KM", title: "Community Run", color: "#4dabbe", image: "/about/distance-5km.png", description: "A timed race that brings together running clubs, groups, recreational runners and active communities of all generations. The 5KM offers the right balance of challenge and accessibility, whether you are racing for time or sharing the experience with your community." },
  { distance: "1.5KM", title: "Family Run", color: "#f29470", image: "/about/distance-family.png", description: "A fun and inclusive distance created for families, children, first-time runners and anyone who wants to experience the energy of EVRS. Run, move and enjoy the atmosphere together while becoming part of the wider journey across the UAE." },
] as const;

export const villages = [
  { name: "Qidfa", image: "/about/race-1.png", color: "#3383cb", registerUrl: qidfa.registerUrl, description: "A coastal village setting that opens the EVRS 2026 season and your journey across the UAE." },
  { name: "Al Lehbab", image: "/about/race-2.png", color: "#675ec4", registerUrl: alLehbab.registerUrl, description: "Experience a different side of Dubai as race two takes the series into Al Lehbab." },
  { name: "Wadi Al-Hilo", image: "/about/race-3.png", color: "#b80547", registerUrl: wadiAlHelo.registerUrl, description: "Continue the journey through one of Sharjah's distinctive village settings." },
  { name: "Falaj Al Mualla", image: "/about/race-4.png", color: "#33aba1", registerUrl: falajAlMualla.registerUrl, description: "Race four brings EVRS to Falaj Al Mualla and another community waiting to be discovered." },
  { name: "Masfout", image: "/about/race5new.png", color: "#b78063", registerUrl: masfout.registerUrl, description: "Continue the series in Masfout and add another village to your EVRS story." },
  { name: "Al Rams", image: "/about/race-6.png", color: "#f38f69", registerUrl: alRams.registerUrl, description: "Race six brings the journey to Al Rams before the series reaches its final chapter." },
  { name: "Al Shuwaib", image: "/about/race-7.png", color: "#dac9bd", registerUrl: alShuwaib.registerUrl, description: "The seventh and final village brings EVRS 2026 together at one last finish line." },
] as const;
