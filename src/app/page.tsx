import { ContentProvider } from "@/context/ContentContext";
import { Desktop } from "@/components/macos/Desktop";
import { readContent } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <ContentProvider content={await readContent()}>
      <Desktop />
    </ContentProvider>
  );
}
