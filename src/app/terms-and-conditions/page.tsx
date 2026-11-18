import type { Metadata } from "next";
import Footer from "@/component/Footer";
import Navbar from "@/component/Navbar";
import TermsRulesContent from "@/component/TermsRulesContent";
import TermsHeroTitle from "@/component/TermsHeroTitle";
import { termsRules } from "@/data/terms-and-conditions";

export const metadata: Metadata = { title: "Terms and Conditions | Emirates Villages Run Series 2026" };

export default function TermsAndConditionsPage() {
  return <><main id="main-content" className="bg-[#f8f8f8]"><section className="bg-[#072f4f] text-white"><Navbar homeHrefPrefix="/" /><div className="mx-auto w-[90%] py-16 md:py-24 2xl:max-w-[1440px]"><TermsHeroTitle fallbackTitle="Terms and Conditions" /></div></section><article className="mx-auto w-[90%] py-12 md:py-20 2xl:max-w-[1440px]"><TermsRulesContent fallbackRules={termsRules} /></article></main><Footer homeHrefPrefix="/" /></>;
}