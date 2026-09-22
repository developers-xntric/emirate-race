import Image from "next/image";

export default function RaceAboutImage({
  src,
  alt,
  sizes,
}: {
  src: string;
  alt: string;
  sizes: string;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[10px]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover object-bottom"
      />
    </div>
  );
}