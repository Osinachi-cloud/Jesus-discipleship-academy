import Link from "next/link";
import prisma from "@/lib/prisma";
import { BookOpen, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getSeries() {
  const series = await prisma.series.findMany({
    include: {
      subcategories: {
        include: {
          posts: {
            where: { status: "published" },
            orderBy: [{ order: "asc" }, { publishedAt: "asc" }],
            select: {
              id: true,
              title: true,
              slug: true,
              order: true,
              excerpt: true,
            },
          },
          _count: {
            select: { posts: { where: { status: "published" } } },
          },
        },
        orderBy: [{ order: "asc" }, { name: "asc" }],
      },
      _count: {
        select: { subcategories: true },
      },
    },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });

  return series;
}

export default async function SeriesPage() {
  const series = await getSeries();

  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-cream-100 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-500/20 backdrop-blur mb-6">
              <BookOpen className="h-8 w-8 text-gold-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Learning <span className="text-gold-500">Series</span>
            </h1>
            <p className="text-lg text-cream-200">
              Structured learning paths to deepen your understanding of Scripture and grow in discipleship.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {series.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No series available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-12">
            {series.map((s) => (
              <div key={s.id} className="bg-white rounded-xl shadow-sm border border-cream-300 overflow-hidden">
                <div className="bg-navy-800 text-cream-100 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl md:text-2xl font-serif font-bold">
                        {s.order !== null && (
                          <span className="text-gold-500 mr-2">#{s.order}</span>
                        )}
                        {s.name}
                      </h2>
                      {s.description && (
                        <p className="text-cream-300 text-sm mt-1">{s.description}</p>
                      )}
                    </div>
                    <div className="text-right text-sm text-cream-300">
                      {s._count.subcategories > 0 && (
                        <span>{s._count.subcategories} topics</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {s.subcategories && s.subcategories.length > 0 ? (
                    <div className="space-y-6">
                      {s.subcategories.map((subcategory, subcategoryIndex) => (
                        <div key={subcategory.id}>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy-100 text-navy-800 font-bold text-sm">
                              {subcategory.order ?? subcategoryIndex + 1}
                            </span>
                            <h3 className="text-lg font-semibold text-navy-800">
                              {subcategory.name}
                            </h3>
                            <span className="text-sm text-gray-400">
                              ({subcategory._count.posts} lessons)
                            </span>
                          </div>
                          {subcategory.description && (
                            <p className="text-gray-600 text-sm mb-3 ml-11">
                              {subcategory.description}
                            </p>
                          )}
                          {subcategory.posts && subcategory.posts.length > 0 && (
                            <div className="ml-11 space-y-2">
                              {subcategory.posts.map((post, postIndex) => (
                                <Link
                                  key={post.id}
                                  href={`/posts/${post.slug}`}
                                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-cream-100 transition-colors group"
                                >
                                  <span className="flex items-center justify-center w-6 h-6 rounded bg-gold-100 text-gold-700 text-xs font-medium">
                                    {post.order ?? postIndex + 1}
                                  </span>
                                  <div className="flex-1">
                                    <span className="text-charcoal-800 group-hover:text-navy-700 font-medium">
                                      {post.title}
                                    </span>
                                    {post.excerpt && (
                                      <p className="text-sm text-gray-500 line-clamp-1">
                                        {post.excerpt}
                                      </p>
                                    )}
                                  </div>
                                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-navy-600" />
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No content in this series yet.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
