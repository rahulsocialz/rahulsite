import Image from "next/image";

/* The single image primitive for the whole site. Fills its container,
   lazy-loads, and supports a blur placeholder + focal point.
   fit="contain" shows the whole photo (used for the project hero, so vertical
   shots aren't cropped); fit="cover" fills the frame (grids and thumbnails). */
export function Media({
  src,
  alt,
  sizes = "100vw",
  priority = false,
  className = "",
  imgClassName = "",
  blurDataURL,
  focal = "50% 50%",
  fit = "cover",
  style,
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  blurDataURL?: string;
  focal?: string;
  fit?: "cover" | "contain";
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative overflow-hidden ${fit === "cover" ? "bg-surface" : ""} ${className}`}
      style={style}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder={blurDataURL ? "blur" : "empty"}
        blurDataURL={blurDataURL}
        style={{ objectPosition: focal }}
        className={`${fit === "contain" ? "object-contain" : "object-cover"} ${imgClassName}`}
      />
    </div>
  );
}
