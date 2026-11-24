import { AdminClient } from "@/components/admin/AdminClient";
import { isAuthed } from "@/lib/auth";
import { readContent } from "@/lib/store";

export default async function AdminPage() {
  return <AdminClient initialContent={await isAuthed() ? await readContent() : null} />;
}
