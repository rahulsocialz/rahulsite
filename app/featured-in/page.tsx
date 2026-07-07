import type { Metadata } from "next";
import { FeaturedList } from "@/components/featured/FeaturedList";

export const metadata: Metadata = {
  title: "Featured In",
  description: "A selection of editorial features and publications.",
};

export default function FeaturedInPage() {
  return (
    <div className="shell pt-28 lg:pt-32">
      <h1 className="h1 gradient-text w-fit">Featured In</h1>
      <p className="lead mt-4 max-w-md text-[1rem]">
        A selection of editorial features and publications.
      </p>
      <div className="mt-10">
        <FeaturedList />
      </div>
      <div className="py-12" />
    </div>
  );
}
