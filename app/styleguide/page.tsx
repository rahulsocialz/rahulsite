"use client";

import { useState } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Divider } from "@/components/ui/Divider";
import { Button, ButtonLink } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { Pill, FilterTab } from "@/components/ui/Pill";
import { Field } from "@/components/ui/Field";
import { Headline } from "@/components/ui/Headline";
import { Reveal } from "@/components/ui/Reveal";
import { Laurel } from "@/components/ui/Laurel";
import { ProjectCard, type ProjectCardData } from "@/components/project/ProjectCard";

const swatches = [
  { name: "Background", varName: "--bg", light: "#FAF8F4", dark: "#090909" },
  { name: "Surface", varName: "--surface", light: "#F4F1EA", dark: "#121212" },
  { name: "Text", varName: "--text", light: "#111111", dark: "#FFFFFF" },
  { name: "Secondary", varName: "--text-secondary", light: "#666666", dark: "rgba(255,255,255,.65)" },
  { name: "Accent (dynamic)", varName: "--accent", light: "from image", dark: "near-mono" },
];

const typeScale = [
  { cls: "display", label: "Display", note: "clamp 3–7.5rem · -0.035em", sample: "Energy" },
  { cls: "h1", label: "Heading 1", note: "clamp 2.4–4rem", sample: "Coldplay" },
  { cls: "h2", label: "Heading 2", note: "clamp 1.75–2.6rem", sample: "Selected Works" },
  { cls: "h3", label: "Heading 3", note: "clamp 1.2–1.6rem", sample: "Music of the Spheres" },
  { cls: "lead", label: "Lead", note: "1.05–1.25rem · muted", sample: "I photograph artists, moments and stories that move people." },
  { cls: "text-body", label: "Body", note: "1rem", sample: "Photographing the Music of the Spheres world tour across multiple continents." },
  { cls: "eyebrow", label: "Eyebrow", note: "0.6875rem · 0.2em · uppercase", sample: "Featured In" },
];

const cards: ProjectCardData[] = [
  { slug: "coldplay", title: "Coldplay", subtitle: "Music of the Spheres", accent: "#3f6fe0", categories: ["Photo", "Video"] },
  { slug: "olivia-rodrigo", title: "Olivia Rodrigo", subtitle: "GUTS World Tour", accent: "#6e4fc0", categories: ["Social", "Photo"] },
  { slug: "nike-fcrb", title: "Nike x F.C. Real Bristol", subtitle: "Campaign", accent: "#c6982f", categories: ["Campaigns"] },
];

const filters = ["All", "Campaigns", "Social", "Photo", "Video", "Art Direction"];

function Block({ title, index, children }: { title: string; index: string; children: React.ReactNode }) {
  return (
    <section className="py-16 lg:py-24">
      <div className="mb-10 flex items-baseline gap-4">
        <span className="font-mono text-caption text-muted">{index}</span>
        <Eyebrow as="h2">{title}</Eyebrow>
      </div>
      {children}
    </section>
  );
}

export default function StyleGuide() {
  const [filter, setFilter] = useState("All");
  const [replay, setReplay] = useState(0);

  return (
    <div className="shell pt-32">
      {/* Intro */}
      <header className="py-16 lg:py-24">
        <Eyebrow>Phase 1</Eyebrow>
        <h1 className="display mt-6 max-w-4xl">Design System</h1>
        <p className="lead mt-8 max-w-xl">
          The complete visual language for Rahul Bhatt. Every page in Phase 2 is
          assembled only from these tokens and components. Toggle light and dark
          in the top-right; hover a project card to feel the dynamic accent.
        </p>
      </header>

      <Divider />
      <Block title="Colour" index="01">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {swatches.map((s) => (
            <div key={s.name}>
              <div
                className="aspect-[4/3] w-full rounded-md border hairline"
                style={{ background: `var(${s.varName})` }}
              />
              <p className="mt-3 text-caption font-medium">{s.name}</p>
              <p className="mt-0.5 font-mono text-[0.7rem] text-muted">L {s.light}</p>
              <p className="font-mono text-[0.7rem] text-muted">D {s.dark}</p>
            </div>
          ))}
        </div>
        <p className="lead mt-8 max-w-xl">
          The interface stays calm. Photography provides the colour. One accent,
          extracted from the active image, touches only buttons, links, active
          navigation, filter underlines and section headings — never the whole UI.
        </p>
      </Block>

      <Divider />
      <Block title="Typography" index="02">
        <div className="space-y-8">
          {typeScale.map((t) => (
            <div key={t.label} className="grid gap-2 border-t hairline pt-6 lg:grid-cols-[200px_1fr]">
              <div>
                <p className="text-caption font-medium">{t.label}</p>
                <p className="mt-1 font-mono text-[0.7rem] text-muted">{t.note}</p>
              </div>
              <p className={t.cls}>{t.sample}</p>
            </div>
          ))}
        </div>
      </Block>

      <Divider />
      <Block title="Buttons & Links" index="03">
        <div className="flex flex-wrap items-center gap-5">
          <Button variant="primary" arrow>View My Work</Button>
          <Button variant="outline">Load More</Button>
          <ButtonLink href="/styleguide" variant="ghost" arrow>View All Articles</ButtonLink>
        </div>
        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-3">
          <TextLink href="/styleguide">Underline grows from the left</TextLink>
          <TextLink href="/styleguide" accent>Accent link on hover</TextLink>
        </div>
      </Block>

      <Divider />
      <Block title="Filters & Pills" index="04">
        <div className="flex flex-wrap gap-x-7 gap-y-3 border-b hairline pb-4">
          {filters.map((f) => (
            <FilterTab key={f} active={filter === f} onClick={() => setFilter(f)}>
              {f}
            </FilterTab>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          <Pill>Photo</Pill>
          <Pill>Video</Pill>
          <Pill>Campaigns</Pill>
          <Pill>Art Direction</Pill>
        </div>
      </Block>

      <Divider />
      <Block title="Project Cards" index="05">
        <p className="lead mb-10 max-w-xl">
          Hover a card: the image scales 3%, the title lifts, the cursor becomes a
          “View” disc, and the accent colour warms to that image.
        </p>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3">
          {cards.map((c, i) => (
            <ProjectCard key={c.slug} project={c} priority={i === 0} />
          ))}
        </div>
      </Block>

      <Divider />
      <Block title="Forms" index="06">
        <form className="grid max-w-2xl gap-8" onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-8 sm:grid-cols-2">
            <Field label="Name" name="sg-name" placeholder="Your name" />
            <Field label="Email" name="sg-email" type="email" placeholder="you@example.com" />
          </div>
          <Field label="Message" name="sg-message" textarea placeholder="Tell me about the project" />
          <div>
            <Button type="submit" variant="primary">Send Message</Button>
          </div>
        </form>
      </Block>

      <Divider />
      <Block title="Awards" index="07">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Clio Award", "Winner, Camila Cabello"],
            ["Clio Award", "Winner, Jon Batiste"],
            ["iHeartRadio", "Favourite Tour Photographer"],
          ].map(([n, d]) => (
            <li key={d} className="flex items-start gap-4">
              <Laurel className="mt-0.5 opacity-70" />
              <div>
                <p className="text-[0.95rem] font-medium">{n}</p>
                <p className="mt-0.5 text-caption text-muted">{d}</p>
              </div>
            </li>
          ))}
        </ul>
      </Block>

      <Divider />
      <Block title="Motion" index="08">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-caption font-medium">Headline line reveal</p>
            <p className="mt-1 font-mono text-[0.7rem] text-muted">each line rises once · 0.8s · no overshoot</p>
            <div className="mt-6" key={replay}>
              <Headline as="h2" className="h1" lines={["Capturing the", "Energy Behind", "the Music."]} />
            </div>
            <button onClick={() => setReplay((r) => r + 1)} className="mt-6 text-caption text-muted underline underline-offset-4 hover:text-fg">
              Replay
            </button>
          </div>
          <div>
            <p className="text-caption font-medium">Section clip reveal</p>
            <p className="mt-1 font-mono text-[0.7rem] text-muted">clip-mask + opacity · not a fade-up</p>
            <Reveal className="mt-6">
              <div className="rounded-md border hairline bg-surface p-8">
                <p className="h3">This block unmasks<br />as it enters the viewport.</p>
              </div>
            </Reveal>
          </div>
        </div>
        <dl className="mt-14 grid gap-x-10 gap-y-6 border-t hairline pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Page transition", "opacity + 100→99→100 · 300ms"],
            ["Image hover", "scale 1.03 · 900ms"],
            ["Button hover", "translateY(-1px)"],
            ["Easing", "cubic-bezier(.22,1,.36,1)"],
          ].map(([t, d]) => (
            <div key={t}>
              <dt className="text-caption font-medium">{t}</dt>
              <dd className="mt-1 font-mono text-[0.7rem] text-muted">{d}</dd>
            </div>
          ))}
        </dl>
      </Block>

      <Divider />
      <Block title="Texture" index="09">
        <p className="lead max-w-xl">
          An animated film grain sits across everything at {`{`}1.5% dark · 0.8% light{`}`},
          drifting almost imperceptibly. Dark mode adds a faint edge vignette; light
          mode a soft paper tooth. Just enough to remove the sterile digital feel —
          you should never consciously notice it.
        </p>
      </Block>

      <div className="py-24" />
    </div>
  );
}
