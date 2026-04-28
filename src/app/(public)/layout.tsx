import { Navbar, Footer, ScriptureTooltip } from "@/components/public";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScriptureTooltip />
    </div>
  );
}
