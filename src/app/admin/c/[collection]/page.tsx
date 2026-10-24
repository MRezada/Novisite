import { isAdmin } from "@/lib/auth";
import { notFound } from "next/navigation";
import { CollectionEditor } from "@/admin/CollectionEditor";
import { MessagesView } from "@/admin/MessagesView";
import { collections } from "@/admin/schema";
import { listAll } from "@/lib/db";

export default async function AdminCollection({ params }: { params: Promise<{ collection: string }> }) {
  if (!(await isAdmin())) return null; // دفاع دوم؛ لایه‌ی اصلی در layout است
  const { collection } = await params;
  if (collection === "messages") return <MessagesView initial={await listAll("messages")} />;
  if (!(collection in collections)) notFound();
  const name = collection as keyof typeof collections;
  const items = await listAll(name);
  return <CollectionEditor name={name} initial={items as unknown as Record<string, unknown>[]} />;
}
