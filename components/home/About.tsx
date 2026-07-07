import { site } from "@/data/site";
import { Placeholder } from "@/components/ui/Placeholder";
import { Media } from "@/components/ui/Media";
import { Divider } from "@/components/ui/Divider";
import { Reveal } from "@/components/ui/Reveal";

/* Image left, text right. Authentic writing, no numbers or counters. */
export function About() {
  return (
    <section className="py-7 lg:py-10">
      <Divider />
      <div className="shell mt-6 grid items-center gap-10 md:grid-cols-[minmax(0,340px)_1fr] lg:gap-20">
        <Reveal>
          {site.about.image ? (
            <Media
              src={site.about.image}
              alt="Rahul Bhatt"
              sizes="(min-width:768px) 340px, 100vw"
              className="aspect-[4/5] w-full"
            />
          ) : (
            <Placeholder label="Portrait" className="aspect-[4/5] w-full" />
          )}
        </Reveal>
        <div>
          <h2 className="h2 gradient-text w-fit">
            {site.about.heading.map((line) => (
              <span key={line} className="block">{line}</span>
            ))}
          </h2>
          <div className="mt-6 max-w-md space-y-4">
            {site.about.body.map((p) => (
              <p key={p} className="lead text-[1rem]">{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
