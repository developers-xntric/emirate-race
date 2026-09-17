import Image from 'next/image';
import Navbar from '@/component/Navbar';
import Footer from '@/component/Footer';
import Button from '@/component/Button';
import SectionHeading from '@/component/SectionHeading';
import RouteMaps from '@/component/races/RouteMaps';
import type { RacePageData } from '@/data/races/types';

const container = 'mx-auto w-[90%] 2xl:max-w-[1440px]';

export default function RacePage({ race }: { race: RacePageData }) {
  return (
    <>
      <main id='main-content' lang='en' dir='ltr' className='overflow-hidden'>
        <section className='relative isolate m-2 flex min-h-[640px] flex-col overflow-hidden rounded-[10px] text-white md:min-h-[560px] lg:min-h-0 lg:aspect-[1891.51/741.569]'>
          <Image src={race.assets.hero} alt='Runners setting off at an Emirates Villages race' fill preload sizes='100vw' className='-z-20 object-cover ' style={{ objectPosition: race.heroPosition }} />
          <div className='absolute inset-0 -z-10 bg-black/50' />
          <Navbar homeHrefPrefix='/' />
          <div className='mx-auto mt-auto grid w-[90%] 2xl:max-w-[1440px] gap-6 pt-28 pb-7 md:pb-10 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16'>
            <h1 className='max-w-[960px] text-[clamp(42px,5.3vw,102px)] leading-[.98] font-bold uppercase'>{race.heroTitle.map(line => <span key={line} className='block'>{line}</span>)}</h1>
            <div>
              <p className='max-w-[680px] text-lg leading-tight 2xl:text-[25px]'>{race.introduction}</p>
              <div className='mt-6 flex flex-wrap items-center gap-3 rounded-[5px] bg-black/30 p-3 backdrop-blur-[22px]'>
                <Image src='/races/race-flag.svg' alt='' width={52} height={34} className='h-[27px] w-[41px] shrink-0 object-contain' />
                <p className='flex-1 text-sm font-bold uppercase 2xl:text-xl'>{race.date}</p>
                <Button href={race.registerUrl} tone='pink' className='max-sm:w-full'>Register for {race.name}</Button>
              </div>
            </div>
          </div>
        </section>

        <section aria-label='About the race' className={`${container} grid gap-5 py-12 md:grid-cols-2 md:gap-7 md:py-20 2xl:py-24`}>
          <div className='relative min-h-[340px] overflow-hidden rounded-[10px] md:min-h-0'>
            <Image src={race.assets.about} alt={race.aboutAlt} fill sizes='(min-width: 1536px) 706px, (min-width: 768px) 44vw, 90vw' className='object-cover object-bottom' />
          </div>
          <div className='relative isolate flex min-h-[500px] flex-col overflow-hidden rounded-[10px] bg-[#072f4f] p-6 text-white lg:min-h-[550px] lg:p-8 2xl:min-h-[688px]'>
            <Image src={race.assets.pattern} alt='' fill sizes='(max-width: 767px) (min-width: 1536px) 706px, (min-width: 768px) 44vw, 90vw' className='pointer-events-none -z-10 object-cover' />
            <Image src={race.assets.mark} alt='' width={143} height={118} className='mb-5 h-[70px] w-[85px] object-contain lg:h-[95px] lg:w-[115px]' />
            <SectionHeading eyebrow='About the Race' title={`Discover ${race.name}`} light />
            <div className='mt-5 space-y-4 text-base leading-[1.45] 2xl:text-xl'>
              {race.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div className='mt-auto pt-7'>
              <h3 className='mb-4 text-lg font-bold uppercase'>Race Day Information</h3>
              <dl className='grid grid-cols-2 gap-x-4 gap-y-5 text-sm lg:grid-cols-[1.5fr_1fr_1fr] 2xl:text-lg'>
                <div className='col-span-2 lg:col-span-1'><dt className='font-bold uppercase'>Date:</dt><dd className='mt-2'>{race.date}</dd></div>
                <div className='lg:border-l lg:border-white/40 lg:pl-5'><dt className='font-bold uppercase'>Arrival Time:</dt><dd className='mt-2'>2:30 PM</dd></div>
                <div className='border-l border-white/40 pl-5'><dt className='font-bold uppercase'>Race Start:</dt><dd className='mt-2'>4:00 PM</dd></div>
              </dl>
            </div>
          </div>
        </section>

        <section aria-label='Race distances' className={`${container} pb-12 md:pb-24`}>
          <div className='mb-7 flex flex-wrap items-center justify-between gap-5 md:mb-10'>
            <SectionHeading eyebrow='Distances' title='Choose Your Challenge' />
            <Button href={race.registerUrl} tone='pink'>Register Now</Button>
          </div>
          <div className='grid gap-5 md:grid-cols-3 md:gap-7'>
            {race.distances.map((item) => (
              <article key={item.distance} className='rounded-[10px] border border-dashed border-[#bb0054] bg-white p-6 2xl:p-8'>
                <h3 className='text-2xl leading-tight font-bold uppercase 2xl:text-[35px]'><span className='mb-1 block text-[#bb0054]'>{item.distance}</span>{item.title}</h3>
                <p className='mt-4 text-base leading-snug text-[#303030] 2xl:text-xl'>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-label='Race route maps' className='relative isolate py-9 md:py-12'>
          <Image src='/races/route-grid.svg' alt='' fill sizes='100vw' className='pointer-events-none -z-10 object-cover' />
          <div className={container}>
            <SectionHeading eyebrow='Race Maps' title='Explore the Route' centered />
            <RouteMaps routes={race.routes} raceName={race.name} logo={race.assets.routeLogo} />
            <div className='mt-8 grid items-center gap-5 bg-white/85 p-4 md:mt-12 md:grid-cols-[1fr_1.1fr_auto] md:gap-10 md:p-8'>
              <div>
                {race.routeCta.eyebrow && <p className='mb-2 text-sm font-bold uppercase text-[#bb0054]'>{race.routeCta.eyebrow}</p>}
                <h3 className='max-w-[430px] text-2xl leading-none font-bold uppercase 2xl:text-[40px]'>{race.routeCta.title}</h3>
              </div>
              <p className='max-w-[515px] text-lg leading-snug text-[#303030] 2xl:text-[25px]'>{race.routeCta.description}</p>
              <Button href={race.registerUrl} tone='pink'>{race.routeCta.button}</Button>
            </div>
          </div>
        </section>

        <section aria-label={`${race.name} location and registration`} className={`${container} grid gap-5 py-12 md:grid-cols-2 md:gap-7 md:py-20 2xl:py-24`}>
          <div className='relative block aspect-[775.543/710.496] overflow-hidden rounded-[10px] border border-[#d7d7d7] bg-[#e8e8e8]'>
            <iframe
              title={`${race.location.name} location map`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(race.location.query)}&output=embed`}
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
              className='absolute inset-0 size-full border-0'
            />
          </div>
          <div className='relative isolate flex min-h-[400px] flex-col overflow-hidden rounded-[10px] bg-[#072f4f] p-6 text-white lg:p-8 2xl:p-10'>
            <h2 className='relative z-10 max-w-[650px] text-[32px] leading-[1.02] font-bold uppercase lg:text-[40px] 2xl:text-[55px]'>{race.journey.title}</h2>
            <p className='relative z-10 mt-4 max-w-[650px] text-lg leading-snug 2xl:text-[25px]'>{race.journey.description}</p>
            <div className='pointer-events-none absolute right-0 bottom-0 -z-10 h-[72.1%] w-[64.7%] overflow-hidden'>
              <div className='absolute top-0 left-0 h-[137.35%] w-[132.36%]'><Image src='/races/journey-art.png' alt='' fill sizes='40vw' className='object-fill' /></div>
            </div>
            <Button href={race.registerUrl} tone='pink' className='mt-auto self-start'>Register to Race</Button>
          </div>
        </section>
      </main>
      <Footer homeHrefPrefix='/' />
    </>
  );
}
