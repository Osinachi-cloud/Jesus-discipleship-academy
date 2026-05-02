import Link from "next/link";
import { Button } from "@/components/ui";
import { BookOpen, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-cream-100 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-500/20 backdrop-blur mb-6">
            <BookOpen className="h-8 w-8 text-gold-500" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-balance text-cream-100">
            Growing in Faith,{" "}
            <span className="text-gold-500">Walking in Truth</span>
          </h1>

          <div className="mb-8">
            <p className="text-gold-400 font-serif text-xl md:text-2xl italic tracking-wide mb-2">
              By Him · through Him · in Him · for Him · unto Him
            </p>
            <p className="text-cream-300/70 text-sm tracking-wider">
              Romans 11:36 • Colossians 1:16
            </p>
          </div>

          <p className="text-lg md:text-xl text-cream-200 mb-8 max-w-2xl mx-auto">
            Welcome to Jesus Discipleship Academy. Discover biblical teachings,
            discipleship resources, and spiritual growth materials to deepen
            your walk with Christ.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/posts">
              <Button size="lg" className="bg-gold-500 text-navy-900 hover:bg-gold-400">
                Explore Content
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/media/books">
              <Button
                size="lg"
                variant="outline"
                className="border-cream-200/30 text-cream-100 hover:bg-cream-100/10"
              >
                Browse Resources
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cream-100 to-transparent" />
    </section>
  );
}
