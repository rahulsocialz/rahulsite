import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[70vh] flex-col justify-center py-32">
      <h1 className="h1">Page not found</h1>
      <p className="lead mt-4">That page doesn&apos;t exist or has moved.</p>
      <Link href="/" className="link mt-8 w-fit text-[0.72rem] uppercase tracking-[0.14em]">
        ← Back home
      </Link>
    </div>
  );
}
