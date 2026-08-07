import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import { rooms, getRoom } from "@/config/taxonomy";
import { getArticlesByRoom, isHubIndexable } from "@/lib/content/queries";
import { ArticleListPage, paginate } from "@/components/articles/ArticleListPage";

export function generateStaticParams() {
  return rooms.map((room) => ({ room: room.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ room: string }>;
}): Promise<Metadata> {
  const { room: roomSlug } = await params;
  const room = getRoom(roomSlug);
  if (!room) return {};
  const count = getArticlesByRoom(roomSlug).length;
  return buildMetadata({
    title: `${room.label} Problems & Guides`,
    description: room.description,
    path: `/rooms/${roomSlug}`,
    noindex: !isHubIndexable(count),
  });
}

export default async function RoomPage({
  params,
  searchParams,
}: {
  params: Promise<{ room: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { room: roomSlug } = await params;
  const room = getRoom(roomSlug);
  if (!room) notFound();

  const sp = await searchParams;
  const all = getArticlesByRoom(roomSlug);
  const { pageItems, totalPages, currentPage, totalCount } = paginate(
    all,
    Number(sp.page) || 1,
  );

  return (
    <ArticleListPage
      title={`${room.label} Problems & Guides`}
      description={room.description}
      breadcrumbs={[{ label: room.label, href: `/rooms/${roomSlug}` }]}
      articles={pageItems}
      totalCount={totalCount}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath={`/rooms/${roomSlug}`}
      searchParams={sp}
      emptyMessage={`We don't have any ${room.label.toLowerCase()} guides yet — check back soon, or browse our full guide library.`}
    />
  );
}
