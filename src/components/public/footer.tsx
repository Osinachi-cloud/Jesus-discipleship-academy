import Link from "next/link";
import { BookOpen, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy-800 text-cream-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gold-500">
                <BookOpen className="h-5 w-5 text-navy-800" />
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-cream-100">
                  Jesus Discipleship
                </span>
                <span className="block text-xs text-gold-500">Academy</span>
              </div>
            </Link>
            <p className="text-cream-300 max-w-md">
              Equipping believers with sound biblical teaching, discipleship
              materials, and resources for spiritual growth and maturity in
              Christ.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-cream-100 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/posts"
                  className="hover:text-gold-500 transition-colors"
                >
                  Posts
                </Link>
              </li>
              <li>
                <Link
                  href="/media/books"
                  className="hover:text-gold-500 transition-colors"
                >
                  Books
                </Link>
              </li>
              <li>
                <Link
                  href="/media/videos"
                  className="hover:text-gold-500 transition-colors"
                >
                  Videos
                </Link>
              </li>
              <li>
                <Link
                  href="/media/images"
                  className="hover:text-gold-500 transition-colors"
                >
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-cream-100 mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/categories/discipleship"
                  className="hover:text-gold-500 transition-colors"
                >
                  Discipleship
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/commentary"
                  className="hover:text-gold-500 transition-colors"
                >
                  Commentary
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/teachings"
                  className="hover:text-gold-500 transition-colors"
                >
                  Teachings
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/devotionals"
                  className="hover:text-gold-500 transition-colors"
                >
                  Devotionals
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-700 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-cream-300">
            &copy; {new Date().getFullYear()} Jesus Discipleship Academy. All
            rights reserved.
          </p>
          <p className="text-sm text-cream-300 flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-gold-500" /> for the Kingdom
          </p>
        </div>
      </div>
    </footer>
  );
}
