"use client";

import { createContext, useContext } from "react";
import type { SiteContent } from "@/lib/types";

const ContentContext = createContext<SiteContent | null>(null);

export function ContentProvider({ content, children }: { content: SiteContent; children: React.ReactNode }) {
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return { content: useContext(ContentContext) };
}
