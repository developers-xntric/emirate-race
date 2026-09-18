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
    pink: "bg-[#bb0054] text-white hover:text-[#072f4f] hover:shadow-[#bb0054]/25",
    white: "bg-white text-[#0b2d4d] hover:text-white hover:shadow-[#0b2d4d]/25",
  };
  const classes = `group relative isolate inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-[5px] px-4 pt-3.5 pb-3 text-center text-sm leading-none font-bold uppercase transition-[color,background-color,box-shadow,transform] duration-280 hover:shadow-lg motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#bb0054] 2xl:text-lg ${colors[tone]} ${className}`;
  const sweepColor =
    tone === "pink" ? "bg-white" : tone === "white" ? "bg-[#0b2d4d]" : null;
  const content = (
    <>
      {sweepColor && (
        <span
          aria-hidden
          className={`absolute -top-1/4 bottom-[-25%] left-1/2 -z-10 w-0 -skew-x-12 ${sweepColor} transition-[left,width] duration-280 ease-out group-hover:left-[-8%] group-hover:w-[116%] motion-reduce:transition-none`}
        />
      )}
      <span className="relative z-10">{children}</span>
    </>
  );

  return href ? <a href={href} className={classes}>{content}</a> : <button type="button" className={classes}>{content}</button>;
}