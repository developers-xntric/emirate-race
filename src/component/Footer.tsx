import Image from "next/image";
import { homeData as data } from "@/data/home-data";
export default function Footer() {
  const columns = [
    data.navigation.slice(0, 3),
    data.navigation.slice(3, 6),
    [
      { label: data.footer.recognition, href: "#recognition" },
      data.navigation[6],
      data.register,
    ],
  ];
  return (
    <footer className="overflow-hidden bg-[#f8f8f8] text-white">
      <div aria-hidden="true" className="flex h-[60px] w-full overflow-hidden">
        {Array.from({ length: 30 }, (_, index) => (
          <Image
            key={index}
            src={data.assets.footerChecker}
            alt=""
            width={110}
            height={75}
            className="-mr-[22px] h-[75px] w-[110px] shrink-0"
          />
        ))}
      </div>
      <div className="bg-[#072f4f]">
        <div className="mx-auto w-[90%] pt-10 2xl:max-w-[1440px]">
          <div className="grid gap-10 md:grid-cols-2 md:gap-[90px]">
            <div className="max-w-[620px]">
              <p className="text-lg leading-tight lg:text-base 2xl:text-lg">
                {data.footer.description}
              </p>
              <p className="mt-5 text-lg leading-tight lg:text-base 2xl:text-lg">
                {data.footer.organizer}
              </p>
              <Image
                src={data.assets.footerLogo}
                alt={data.brand}
                width={486}
                height={107}
                className="mt-9 md:h-[96px] w-[200px] md:w-[438px] max-w-full object-contain object-left"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">{data.footer.quickLinks}</h2>
              <div className="mt-7 grid grid-cols-3 gap-5">
                {columns.map((column, index) => (
                  <ul key={index} className="space-y-4">
                    {column.map((link) => (
                      <li key={link.href}>
                        {link.href ? (
                          <a
                            href={link.href}
                            className="text-base hover:underline 2xl:text-[22px]"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <button
                            type="button"
                            className="text-left text-base 2xl:text-[22px]"
                          >
                            {link.label}
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
              <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
                <a
                  href={`mailto:${data.footer.email}`}
                  className="flex items-center gap-3 text-lg font-bold hover:underline"
                >
                  <Image
                    src={data.assets.email}
                    alt=""
                    width={49}
                    height={49}
                    className="size-[49px]"
                  />
                  {data.footer.email}
                </a>
                <div className="flex gap-3">
                  {data.footer.socials.map((label) => (
                    <span
                      key={label}
                      className="rounded-[5px] bg-[#114474] px-6 py-4 text-sm"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-between gap-4 border-t border-white/30 py-6 text-sm 2xl:text-base">
            <p>{data.footer.copyright}</p>
            <div className="flex flex-wrap gap-4">
              {data.footer.legal.map((label, index) => (
                <span key={label}>
                  {index > 0 && (
                    <span aria-hidden="true" className="mr-4">
                      |
                    </span>
                  )}
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
