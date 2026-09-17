'use client';

import Image from 'next/image';
import { useRef, useState, type KeyboardEvent } from 'react';
import type { RaceRoute } from '@/data/races/types';

export default function RouteMaps({ routes, raceName, logo }: { routes: RaceRoute[]; raceName: string; logo: string }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % routes.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + routes.length) % routes.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = routes.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <div className='mt-7 md:mt-9' dir='ltr'>
      <div role='tablist' aria-label={raceName + ' race routes'} className='mx-auto mb-6 grid max-w-[1050px] grid-cols-2 gap-3 md:mb-8 md:flex md:justify-center md:gap-5'>
        {routes.map((route, index) => (
          <button key={route.id} ref={(node) => { tabs.current[index] = node; }}
            id={`route-tab-${route.id}`} type='button' role='tab'
            aria-selected={active === index} aria-controls={`route-panel-${route.id}`}
            tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => handleKey(event, index)}
            className={`cursor-pointer rounded-[5px] px-3 py-3 text-sm leading-tight font-bold text-white uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#bb0054] md:px-4 md:text-lg 2xl:text-xl ${active === index ? 'bg-[#bb0054]' : 'bg-[#072f4f] hover:bg-[#12486f]'}`}>
            {route.label}
          </button>
        ))}
      </div>
      {routes.map((route, index) => (
        <div key={route.id} role='tabpanel' id={`route-panel-${route.id}`} aria-labelledby={`route-tab-${route.id}`}
          hidden={active !== index} tabIndex={0} className='focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#bb0054]'>
          <div className='relative aspect-[1590/763.449] overflow-hidden bg-[#072f4f]'>
            <div className='absolute inset-x-0' style={{ height: route.imageHeight, top: route.imageTop ?? '0%' }}>
              <Image src={route.image} alt={`${route.label} route in ${raceName}, showing the start, finish and course markers`} fill sizes='(min-width: 1536px) 1440px, 90vw' className='object-cover' />
            </div>
            <div className='absolute w-[12.67%] aspect-[201.45/67.689]' style={{ left: route.logoLeft, top: route.logoTop }}>
              <Image src={logo} alt='Emirates Villages Run Series' fill className='object-contain' sizes='(min-width: 1536px) 183px, 12vw' />
            </div>
          </div>
          <a href={route.image} target='_blank' rel='noreferrer' className='mt-3 inline-block text-sm font-semibold text-[#072f4f] underline underline-offset-4 md:hidden'>Open full-size map</a>
        </div>
      ))}
    </div>
  );
}
