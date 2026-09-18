import Image from "next/image";

export default function RaceAboutImage({
  src,
  video,
  alt,
  sizes,
}: {
  src: string;
  video: string;
  alt: string;
  sizes: string;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[10px] [perspective:1200px]">
      <div className="relative h-full w-full transition-transform duration-700 ease-out [transform-style:preserve-3d] motion-safe:group-hover:[transform:rotateX(180deg)] motion-reduce:transition-none">
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            className="scale-10 object-cover object-bottom transition-transform duration-1000 ease-out group-data-[revealed=true]:scale-100"
          />
        </div>
        <div className="absolute inset-0 [transform:rotateX(180deg)] [backface-visibility:hidden]">
          <video
            src={video}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
            className="size-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}