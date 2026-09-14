import Image from "next/image";
import { homeData as data } from "@/data/home-data";
import SectionHeading from "./SectionHeading";
import Button from "./Button";

function QuickFactCard({
  fact,
}: {
  fact: (typeof data.distances.facts)[number];
}) {
  return (
    <article className="flex min-h-[100px] w-[250px] shrink-0 flex-col items-center justify-center rounded-[5px] border border-[#bb0054]/20 bg-black/30 p-2 text-center backdrop-blur-md lg:w-[300px]">
      <h3 className="text-xl font-bold uppercase 2xl:text-[28px]">
        {fact.title}
      </h3>
      <p className="mt-2 max-w-[230px] text-lg leading-tight lg:text-base 2xl:text-lg">
        {fact.detail}
      </p>
    </article>
  );
}

export default function RaceDistances() {
  const marqueeFacts = [...data.distances.facts, ...data.distances.facts];

  return (
    <section
      id="distances"
      className="relative isolate overflow-hidden py-16 text-white md:py-20 2xl:py-[85px]"
    >
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <div className="relative md:block hidden -top-[11.55%] h-[111.54%] w-full">
          <Image
            src={data.assets.distancesBackground}
            alt=""
            fill
            sizes="100vw"
            className="object-fill"
          />
        </div>
        <div className="relative md:hidden block -top-[11.55%] h-[111.54%] w-full">
          <Image
            src={data.assets.distancesBackgroundMobile}
            alt=""
            fill
            sizes="100vw"
            className="object-fill"
          />
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-black/50" />
      <div className="mx-auto w-[90%] 2xl:max-w-[1440px]">
        <SectionHeading
          eyebrow={data.distances.eyebrow}
          title={data.distances.title}
          light
        />
        <div className="mt-12 grid gap-[30px] md:grid-cols-3 2xl:mt-[62px]">
          {data.distances.cards.map((card) => (
            <article
              key={card.title}
              className="flex flex-col rounded-[10px] bg-white/10 p-4 backdrop-blur-[6px] md:backdrop-blur-[12px]"
            >
              <div className="relative aspect-[473.38/320.86] overflow-hidden rounded-[5px]">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  sizes="(min-width: 768px) 30vw, 90vw"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-3 md:mt-6 text-[20px] md:text-[25px] leading-none font-bold uppercase 2xl:text-[32px]">
                {card.title}
              </h3>
              <p className="mt-3 mb-4 md:mb-6 text-lg leading-[1.25] lg:text-base 2xl:text-lg">
                {card.description}
              </p>
              <Button
                href={data.register.href}
                tone="pink"
                className="mt-auto w-full"
              >
                {card.cta}
              </Button>
            </article>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-2 text-sm font-bold uppercase 2xl:mt-[54px] 2xl:text-lg">
          <p>{data.distances.factsLabel}</p>
          <p>{data.distances.factsTitle}</p>
        </div>
      </div>
      <div
        className="mt-5 w-full overflow-hidden"
        aria-label={data.distances.factsTitle}
      >
        <div className="flex w-max gap-4 pr-4 motion-safe:animate-quick-facts motion-reduce:translate-x-0 lg:gap-[30px] lg:pr-[30px]">
          {marqueeFacts.map((fact, index) => (
            <QuickFactCard key={`${fact.title}-${index}`} fact={fact} />
          ))}
        </div>
      </div>
    </section>
  );
}
