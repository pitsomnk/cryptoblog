import React from "react";

export default function ListingLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {title && <h1 className="mb-6 text-3xl font-bold">{title}</h1>}
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}
