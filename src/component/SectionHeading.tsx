export default function SectionHeading({
  eyebrow,
  title,
  light = false,
  centered = false,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  light?: boolean;
  centered?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={centered ? "text-center" : ""}>
      <p
        className={`mb-2 md:mb-3 text-sm font-bold uppercase md:text-base 2xl:text-lg ${light ? "text-white" : "text-[#bb0054]"}`}
      >
        {eyebrow}
      </p>
      <h2
        className={`${compact ? " text-[30px] md:text-[38px] lg:text-[40px] 2xl:text-[44px]" : "text-[32px] md:text-[40px] lg:text-[40px] 2xl:text-[44px]"} leading-[1.02] font-bold uppercase ${light ? "text-white" : "text-[#0b2d4d]"}`}
      >
        {title}
      </h2>
    </div>
  );
}
