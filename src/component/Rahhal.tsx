import Image from "next/image";
import { homeData as data } from "@/data/home-data";
import SectionHeading from "./SectionHeading";
import Button from "./Button";
function ChallengeMessage({ className = "" }: { className?: string }) {
  return (
    <div className={`mt-8 2xl:mt-16 ${className}`}>
      <p className="w-fit bg-[#0b2d4d] px-4 py-3  md:text-xl leading-none font-bold text-white uppercase 2xl:text-[28px]">
        {data.rahhal.challenge}
      </p>
      <p className="w-fit bg-[#bb0054] px-4 py-3  md:text-lg leading-none font-bold text-white uppercase 2xl:text-[24px]">
        {data.rahhal.invitation}
      </p>
    </div>
  );
}

export default function Rahhal() {
  return (
    <section
      id="rahhal"
      className="relative mx-auto w-[90%] scroll-mt-8 pb-16 2xl:max-w-[1440px] 2xl:pb-[82px]"
    >
      <p
        aria-hidden="true"
        className="pointer-events-none bg-linear-to-t from-white from-[16.513%] to-[#bb0054] to-[562.82%] bg-clip-text text-center text-[15rem] leading-none font-bold text-transparent uppercase hidden lg:block lg:text-[11.2em] 2xl:text-[14rem]"
      >
        {data.rahhal.eyebrow}
      </p>
      <div className="relative grid items-center gap-8 lg:-mt-19 lg:grid-cols-[1fr_.88fr_1fr] lg:gap-5">
        <div>
          <SectionHeading
            eyebrow={data.rahhal.eyebrow}
            title={data.rahhal.title}
            compact
          />
          <div className="mt-3 space-y-5 text-lg leading-[1.25] text-black lg:text-base 2xl:text-lg">
            {data.rahhal.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          <ChallengeMessage className="hidden lg:block" />
        </div>
        <div className="mx-auto w-full max-w-[320px] sm:max-w-[340px] lg:max-w-[420px]">
          <div className="relative aspect-[460.39/689.87] w-full">
            <p
              aria-hidden="true"
              className="pointer-events-none absolute top-[20%] left-1/2 z-0 w-max text-center -translate-x-1/2 -translate-y-1/2 text-[25vw] leading-none font-bold text-[#bb0054]/20 uppercase lg:hidden"
            >
              <span className="block">Meet</span>
              <span className="block">Rahhal</span>
            </p>
            <Image
              src={data.assets.rahhal}
              alt={data.rahhal.eyebrow}
              fill
              sizes="(min-width: 1024px) 28vw, 80vw"
              className="z-10 object-contain"
            />
          </div>
          <ChallengeMessage className="lg:hidden" />
        </div>
        <div className="grid grid-cols-2">
  {data.rahhal.traits.map((trait, i) => (
    <article
      key={trait.title}
      className={`flex min-h-[235px] flex-col ${
        i === 0 || i === 2 ? "justify-start" : "justify-end"
      } gap-3 rounded-[20px] p-5 text-white 2xl:min-h-[253px] ${trait.color}`}
    >
      <h3 className="text-xl leading-none font-bold uppercase 2xl:text-[24px]">
        {trait.title}
      </h3>

      <p className="text-base font-light leading-[1.25] 2xl:text-lg">
        {trait.description}
      </p>
    </article>
  ))}
</div>
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-5">
        <Button href="#calendar">{data.rahhal.follow}</Button>
        <Button href={data.register.href} tone="pink">
          {data.rahhal.register}
        </Button>
      </div>
    </section>
  );
}
