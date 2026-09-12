import Image from "next/image";
import { homeData as data } from "@/data/home-data";
import SectionHeading from "./SectionHeading";
import Button from "./Button";
export default function RaceCalendar() {
  return (
    <section
      id="calendar"
      className="mx-auto w-[95%] scroll-mt-8 py-16 md:py-20 2xl:max-w-[1600px] 2xl:py-[90px]"
    >
      <div className="relative isolate overflow-hidden rounded-[20px] border border-[#bb0054]/10 px-5 py-12 lg:px-8">
        <Image
          src={data.assets.calendarGrid}
          alt=""
          fill
          className="-z-10 object-cover"
          sizes="90vw"
        />
        <SectionHeading
          eyebrow={data.calendar.eyebrow}
          title={data.calendar.title}
          centered
        />
        <div className="relative mt-20 grid grid-cols-2 gap-x-6 gap-y-16 sm:grid-cols-3 lg:mt-[115px] lg:mb-[125px] lg:grid-cols-7 lg:gap-2">
          <svg
            aria-hidden="true"
            viewBox="0 0 1500 220"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 -top-24 z-0 hidden aspect-[1500/220] w-full overflow-visible lg:block"
          >
            <path
              d="M0 186 L286 86 L513 191 L715 61 L1013 171 L1217 66 L1500 186"
              fill="none"
              stroke="#072F4F"
              strokeOpacity="0.32"
              strokeWidth="4.8"
              strokeDasharray="9.6 9.6"
            />
          </svg>
          {data.calendar.races.map((race, index) => (
            <article
              key={race.date}
              aria-label={`${data.calendar.raceLabel} ${index + 1}: ${race.village}, ${race.day} ${race.month}`}
              className={`relative z-10 mx-auto flex aspect-square w-full max-w-[195px] flex-col justify-end rounded-[9px] bg-[#072f4f] p-3 text-white transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#bb0054] ${race.position}`}
            >
              <Image
                src={race.art}
                alt=""
                width={race.artWidth * 0.75}
                height={race.artHeight * 0.75}
                className="absolute -top-12 left-4 object-contain"
              />
              <div className="relative pt-5 text-xs leading-tight font-bold 2xl:text-sm">
                <p className="uppercase">
                  {data.calendar.raceLabel} {String(index + 1).padStart(2, "0")}
                </p>
                <p>{race.emirate}</p>
              </div>
              <div className="mt-2 flex items-center justify-between gap-1">
                <Image
                  src={race.icon}
                  alt=""
                  width={race.iconWidth * 0.7}
                  height={race.iconHeight * 0.7}
                  className="shrink-0 object-contain"
                />
                <time
                  dateTime={race.date}
                  className="text-center text-[10px] leading-none"
                >
                  <span className="block">{data.calendar.dayLabel}</span>
                  <strong className="block text-[32px] 2xl:text-[40px]">
                    {race.day}
                  </strong>
                  <span>{race.month}</span>
                </time>
              </div>
              <h3 className="mt-2 text-[17px] leading-none font-bold 2xl:text-xl">
                {race.village}
              </h3>
            </article>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-5">
          <Button href={data.register.href}>{data.calendar.register}</Button>
          <Button href="#distances" tone="pink">
            {data.calendar.details}
          </Button>
        </div>
      </div>
    </section>
  );
}
