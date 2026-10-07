import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">ShortLink on AWS</h1>
        <ThemeToggle />
      </div>
    </main>
  );
}
