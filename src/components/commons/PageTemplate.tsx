import React from "react";

export default function PageTemplate({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-6">
      <div className="border-b border-slate-200 pb-2">
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      </div>
      {children}
    </section>
  );
}