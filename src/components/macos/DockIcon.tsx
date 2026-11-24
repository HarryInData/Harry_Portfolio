import type { ReactNode } from "react";
import type { AppId } from "@/lib/apps";

const svg = (children: ReactNode, className = "h-6 w-6") => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none">
    {children}
  </svg>
);

export function DockIcon({ id }: { id: AppId | "admin" }) {
  const wrap = (background: string, icon: ReactNode) => (
    <span className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-[23%] shadow-[0_3px_8px_rgba(0,0,0,.36),inset_0_1px_0_rgba(255,255,255,.4)] ${background}`}>
      {icon}
    </span>
  );

  switch (id) {
    case "finder":
      return wrap("bg-gradient-to-b from-[#65c5ff] to-[#0759c8]", svg(
        <>
          <path d="M3 7.5a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="#f5fbff" />
          <path d="M3.5 10h17" stroke="#b8e2ff" strokeWidth="1.2" />
          <path d="M6 13h12M6 16h9" stroke="#b9d8f0" strokeWidth="1.1" strokeLinecap="round" />
        </>,
        "h-7 w-7",
      ));
    case "safari":
      return wrap("bg-gradient-to-br from-[#c34dff] to-[#5421bb]", svg(
        <>
          <path d="M9.5 14.5 7.8 16.2a3.5 3.5 0 0 1-5-5l3-3a3.5 3.5 0 0 1 5 0" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <path d="m14.5 9.5 1.7-1.7a3.5 3.5 0 0 1 5 5l-3 3a3.5 3.5 0 0 1-5 0" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <path d="m8.5 15.5 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </>,
        "h-7 w-7",
      ));
    case "projects":
      return wrap("bg-gradient-to-b from-[#383838] to-[#111]", svg(
        <path fill="white" d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.6-1.3-1.6-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.4-1.3-5.4-5.8 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6.1 0C17.9 4.7 19 5 19 5c.6 1.7.2 2.9.1 3.2.8.9 1.2 2 1.2 3.3 0 4.5-2.7 5.5-5.4 5.8.4.3.8 1 .8 2.1v2.9c0 .3.2.7.8.6A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />,
        "h-7 w-7",
      ));
    case "skills":
      return wrap("bg-gradient-to-br from-[#44a8ff] to-[#0756b5]", svg(
        <path fill="white" d="m17.7 2.3-9.3 8.3-4.2-3.1-2.4 1.2 4.8 3.2-4.8 3.4 2.4 1.2 4.2-3.2 9.3 8.4 4.3-2.1V4.4zm-.7 4.2v11l-6-5.5z" />,
        "h-7 w-7",
      ));
    case "certs":
      return wrap("bg-gradient-to-b from-[#ff7772] to-[#cf171e]", svg(
        <path d="M4 19 11.8 4h1.5L21 19h-3.2l-1.5-3.1H9L7.4 19zm6.3-5.7h4.6l-2.3-4.8z" fill="white" />,
        "h-7 w-7",
      ));
    case "resume":
      return wrap("bg-gradient-to-br from-[#ffd44c] to-[#e99500]", svg(
        <>
          <path d="M6 2h8l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2" fill="#fffdf4" />
          <path d="M14 2v5h5M8 12h8M8 15h8M8 18h5" stroke="#e99d00" strokeWidth="1.4" strokeLinecap="round" />
        </>,
        "h-7 w-7",
      ));
    case "photos":
      return wrap("bg-white", <span className="h-8 w-8 rounded-full bg-[conic-gradient(from_0deg,#ffd24a_0_16%,#f47646_16%_32%,#d94e85_32%_48%,#8f62c5_48%_64%,#4a94dd_64%_80%,#4cbf8b_80%_100%)] shadow-inner" />);
    case "music":
      return wrap("bg-gradient-to-br from-[#40df86] to-[#087c47]", svg(
        <>
          <circle cx="12" cy="12" r="9.5" fill="#101820" />
          <path d="M6 9.5c4-1.2 8.4-.6 11.6 1.4M7 12.5c3.1-.9 6.7-.4 9.4 1.2M8.3 15.3c2.4-.6 4.6-.2 6.5.8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        </>,
        "h-7 w-7",
      ));
    case "mail":
      return wrap("bg-gradient-to-b from-[#78d8ff] to-[#0874dc]", svg(
        <>
          <rect x="2.5" y="5" width="19" height="14" rx="2" fill="#f8fcff" />
          <path d="m3.5 7 8.5 6 8.5-6" stroke="#1384e6" strokeWidth="1.5" strokeLinejoin="round" />
        </>,
        "h-7 w-7",
      ));
    case "terminal":
      return wrap("bg-gradient-to-b from-[#353940] to-[#050608]", svg(
        <>
          <path d="m5 7 5 5-5 5M12 17h7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </>,
        "h-7 w-7",
      ));
    default:
      return wrap("bg-gradient-to-b from-[#a9adb4] to-[#51565f]", svg(
        <>
          <path d="m12 2 1.2 2.2 2.5.5 2.1-1.2 1.8 1.8-1.2 2.1.5 2.5L21 11v2l-2.1 1.1-.5 2.5 1.2 2.1-1.8 1.8-2.1-1.2-2.5.5L12 22l-2.2-1.2-2.5-.5-2.1 1.2-1.8-1.8 1.2-2.1-.5-2.5L2 13v-2l2.1-1.1.5-2.5-1.2-2.1 1.8-1.8 2.1 1.2 2.5-.5z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5" />
        </>,
        "h-6 w-6",
      ));
  }
}
