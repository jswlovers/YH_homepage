import Link from "next/link";

export type LegalSection = {
  title: string;
  paragraphs: string[];
  items?: string[];
};

type LegalDocumentProps = {
  title: string;
  updatedAt: string;
  summary: string;
  notice?: string;
  sections: LegalSection[];
};

export default function LegalDocument({
  title,
  updatedAt,
  summary,
  notice,
  sections,
}: LegalDocumentProps) {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-12 sm:pt-16">
      <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
        ← 홈으로
      </Link>
      <header className="border-b border-neutral-200 pb-8 pt-10 dark:border-neutral-800">
        <p className="text-xs uppercase tracking-widest text-neutral-500">YH · 정책 문서</p>
        <h1 className="mt-3 font-serif text-3xl sm:text-4xl">{title}</h1>
        <p className="mt-4 text-sm leading-7 text-neutral-600 dark:text-neutral-400">{summary}</p>
        <p className="mt-5 text-xs text-neutral-500">최종 개정일: {updatedAt}</p>
      </header>
      {notice && (
        <aside className="mt-8 border-l-2 border-amber-600 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">
          {notice}
        </aside>
      )}
      <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {sections.map((section, index) => (
          <section key={section.title} className="py-7">
            <h2 className="font-serif text-xl">제{index + 1}조 {section.title}</h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-neutral-700 dark:text-neutral-300">
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.items && (
                <ul className="list-disc space-y-1 pl-5">
                  {section.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </div>
          </section>
        ))}
      </div>
      <nav aria-label="정책 문서" className="flex gap-5 border-t border-neutral-200 pt-6 text-sm dark:border-neutral-800">
        <Link href="/terms" className="text-neutral-500 underline underline-offset-4 hover:text-neutral-900 dark:hover:text-neutral-100">이용약관</Link>
        <Link href="/privacy" className="text-neutral-500 underline underline-offset-4 hover:text-neutral-900 dark:hover:text-neutral-100">개인정보처리방침</Link>
      </nav>
    </main>
  );
}