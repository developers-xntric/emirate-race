import Image from "next/image";
import { homeData as data } from "@/data/home-data";
import SectionHeading from "./SectionHeading";
export default function FAQs() {
  return (
    <section id="faqs" className="bg-[#f8f8f8] pt-16 md:pt-20">
      <div className="mx-auto w-[90%] 2xl:max-w-[1440px]">
        <SectionHeading
          eyebrow={data.faq.eyebrow}
          title={data.faq.title}
          centered
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 md:gap-[30px]">
          {data.faq.columns.map((column, index) => (
            <div key={index} className="space-y-5">
              {column.map((item, itemIndex) => (
                <details
                  key={item.question}
                  open={index === 0 && itemIndex === 0}
                  id={
                    item.question === "Are there prizes?"
                      ? "prize-answer"
                      : undefined
                  }
                  className="group scroll-mt-8 rounded-[10px] border border-[#bb0054] open:bg-white"
                >
                  <summary className="flex min-h-[74px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-base leading-tight font-bold uppercase focus-visible:outline-2 focus-visible:outline-[#072f4f] 2xl:text-lg [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <Image
                      src={data.assets.plus}
                      alt=""
                      width={17}
                      height={17}
                      className="size-[17px] shrink-0 transition-transform group-open:rotate-45"
                    />
                  </summary>
                  {item.answer && (
                    <p className="px-5 pb-5 text-lg leading-snug text-[#171717] lg:text-base 2xl:text-lg">
                      {item.answer}
                    </p>
                  )}
                </details>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
