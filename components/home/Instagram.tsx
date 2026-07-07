import { site } from "@/data/site";
import { Placeholder } from "@/components/ui/Placeholder";
import { Media } from "@/components/ui/Media";
import { Divider } from "@/components/ui/Divider";
import { Eyebrow } from "@/components/ui/Eyebrow";

/* Six square tiles in one row. Hover lifts a tile 2%. Links to the profile. */
export function Instagram() {
  return (
    <section className="py-7 lg:py-10">
      <Divider />
      <div className="shell mt-6 flex items-end justify-between">
        <Eyebrow as="h2">Latest on Instagram</Eyebrow>
        <a
          href={site.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link text-[0.72rem] uppercase tracking-[0.14em] light:text-[var(--accent)]"
        >
          Follow {site.instagramHandle}
        </a>
      </div>
      <div className="shell mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
        {Array.from({ length: 6 }, (_, i) => {
          const src = site.instagram.images[i];
          return (
            <a
              key={i}
              href={site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram post"
              className="group block overflow-hidden"
            >
              {src ? (
                <Media
                  src={src}
                  alt="Instagram post"
                  sizes="(min-width:640px) 16vw, 33vw"
                  className="aspect-square"
                  imgClassName="transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.02]"
                />
              ) : (
                <Placeholder className="aspect-square transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.02]" />
              )}
            </a>
          );
        })}
      </div>
    </section>
  );
}
