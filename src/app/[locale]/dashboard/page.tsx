import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Authenticate session server-side
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect(`/${locale}/dashboard/login`);
  }

  // Fetch initial data lists for the dashboard
  const quotes = await prisma.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  const docs = await prisma.document.findMany({
    orderBy: { priceEGP: "asc" },
  });

  const embassies = await prisma.embassy.findMany({
    orderBy: { nameAr: "asc" },
  });

  const govs = await prisma.govEntity.findMany({
    orderBy: { nameAr: "asc" },
  });

  const langs = await prisma.language.findMany({
    orderBy: [{ popular: "desc" }, { nameAr: "asc" }],
  });

  const branches = await prisma.branch.findMany({
    orderBy: { nameAr: "asc" },
  });

  const team = await prisma.teamMember.findMany({
    orderBy: [{ isLeadership: "desc" }, { nameAr: "asc" }],
  });

  const reviews = await prisma.review.findMany({
    orderBy: { date: "desc" },
  });

  const posts = await prisma.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
  });

  const faqs = await prisma.fAQ.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const settings = await prisma.siteSetting.findMany({
    orderBy: { key: "asc" },
  });

  // Serialize models for Next.js App Router Client Component boundary safety
  const serializeList = (list: any[]) =>
    list.map((item) => {
      const serialized = { ...item };
      if (item.createdAt) serialized.createdAt = item.createdAt.toISOString();
      if (item.updatedAt) serialized.updatedAt = item.updatedAt.toISOString();
      if (item.publishedAt) serialized.publishedAt = item.publishedAt.toISOString();
      if (item.date) serialized.date = item.date.toISOString();
      return serialized;
    });

  const user = {
    name: session.user.name || "Manager",
    email: session.user.email || "",
    role: (session.user as any).role || "EDITOR",
  };

  return (
    <DashboardClient
      user={user}
      initialQuotes={serializeList(quotes)}
      initialDocs={serializeList(docs)}
      initialEmbassies={serializeList(embassies)}
      initialGovs={serializeList(govs)}
      initialLangs={serializeList(langs)}
      initialBranches={serializeList(branches)}
      initialTeam={serializeList(team)}
      initialReviews={serializeList(reviews)}
      initialPosts={serializeList(posts)}
      initialFaqs={serializeList(faqs)}
      initialSettings={serializeList(settings)}
    />
  );
}
