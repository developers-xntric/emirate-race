import type { ReactNode } from "react";
export default function Button({
  children,
  href,
  tone = "navy",
  className = "",
}: {
  children: ReactNode;
  href: string;
  tone?: "navy" | "pink" | "white";
  className?: string;
}) {
  const colors = {
    navy: "bg-[#0b2d4d] text-white hover:bg-[#072f4f] hover:shadow-[#072f4f]/25",
    pink: "bg-[#bb0054] text-white hover:bg-[#9e0047] hover:shadow-[#bb0054]/25",
    white: "bg-white text-[#072f4f] hover:bg-[#f8f8f8] hover:shadow-black/20",
  };
  const classes = `inline-flex items-center justify-center rounded-[5px] px-4 pt-3.5 pb-3 text-center text-sm leading-none font-bold uppercase cursor-pointer transition-[background-color,box-shadow,transform] duration-200 hover:shadow-lg motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#bb0054]  2xl:text-lg ${colors[tone]} ${className}`;
  return href ? (
    <a href={href} className={classes}>
      {children}
    </a>
  ) : (
    <button type="button" className={classes}>
      {children}
    </button>
  );
}
