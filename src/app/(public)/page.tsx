import Link from "next/link";
import { Hero, PostCard } from "@/components/public";
import { Button, Badge } from "@/components/ui";
import prisma from "@/lib/prisma";
import { ArrowRight, BookOpen, Video, Image as ImageIcon } from "lucide-react";

async function getHomeData() {
  const [posts, categories, mediaStats] = await Promise.all([
    prisma.post.findMany({
      where: { status: "published" },
      include: {
        category: true,
        _count: { select: { comments: true } },
      },
      orderBy: { publishedAt: "desc" },
      take: 6,
    }),
    prisma.category.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.media.groupBy({
      by: ["type"],
      _count: { id: true },
    }),
  ]);

  return { posts, categories, mediaStats };
}

export default async function HomePage() {
  const { posts, categories, mediaStats } = await getHomeData();

  const getMediaCount = (type: string) => {
    const stat = mediaStats.find((s) => s.type === type);
    return stat?._count.id || 0;
  };

  return (
    <div>
      <Hero />

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-navy-800">
              Latest Posts
            </h2>
            <Link href="/posts">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {posts.length === 0 ? (
            <p className="text-center text-charcoal-500 py-12">
              No posts published yet. Check back soon!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-cream-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-navy-800 text-center mb-8">
            Browse by Category
          </h2>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Badge
                  variant="default"
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-cream-300 transition-colors"
                >
                  {category.name}
                  <span className="ml-2 text-charcoal-400">
                    ({category._count.posts})
                  </span>
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-navy-800 text-center mb-8">
            Resources Library
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/media/books" className="group">
              <div className="card p-8 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-100 mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-8 w-8 text-gold-600" />
                </div>
                <h3 className="text-xl font-semibold text-navy-800 mb-2">
                  Books & PDFs
                </h3>
                <p className="text-charcoal-600 mb-3">
                  Download discipleship materials and study resources
                </p>
                <p className="text-2xl font-bold text-gold-600">
                  {getMediaCount("book")} books
                </p>
              </div>
            </Link>

            <Link href="/media/videos" className="group">
              <div className="card p-8 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-navy-100 mb-4 group-hover:scale-110 transition-transform">
                  <Video className="h-8 w-8 text-navy-600" />
                </div>
                <h3 className="text-xl font-semibold text-navy-800 mb-2">
                  Video Teachings
                </h3>
                <p className="text-charcoal-600 mb-3">
                  Watch sermons, Bible studies, and teachings
                </p>
                <p className="text-2xl font-bold text-navy-600">
                  {getMediaCount("video")} videos
                </p>
              </div>
            </Link>

            <Link href="/media/images" className="group">
              <div className="card p-8 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cream-300 mb-4 group-hover:scale-110 transition-transform">
                  <ImageIcon className="h-8 w-8 text-charcoal-600" />
                </div>
                <h3 className="text-xl font-semibold text-navy-800 mb-2">
                  Image Gallery
                </h3>
                <p className="text-charcoal-600 mb-3">
                  Browse inspiring images and graphics
                </p>
                <p className="text-2xl font-bold text-charcoal-700">
                  {getMediaCount("image")} images
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-navy-800 text-cream-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-cream-100">
            "Go therefore and make disciples of all nations"
          </h2>
          <p className="text-gold-500 text-lg mb-6">— Matthew 28:19</p>
          <p className="text-cream-200 max-w-2xl mx-auto">
            Our mission is to equip believers with sound biblical teaching and
            practical resources for living out the call to discipleship.
          </p>
        </div>
      </section>
    </div>
  );
}
