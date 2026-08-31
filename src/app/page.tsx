import DesignCard from "@/components/DesignCard";
import { designs } from "@/lib/designs";

// 문의 이메일 — 실제 주소로 교체하세요.
const CONTACT_EMAIL = "your-email@example.com";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 pb-20">
      <section className="py-16 text-center">
        <h1 className="font-serif text-4xl sm:text-5xl">Design Portfolio</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-neutral-500">
          작업물을 소개하고 문의를 받는 공간입니다. 마음에 드는 작품이 있으면
          아래 이메일로 편하게 연락 주세요.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {designs.map((design) => (
          <DesignCard key={design.id} design={design} />
        ))}
      </section>

      <section className="mt-24 rounded-lg border border-neutral-200 px-6 py-10 text-center dark:border-neutral-800">
        <h2 className="font-serif text-2xl">문의하기</h2>
        <p className="mt-2 text-sm text-neutral-500">
          작품 구매, 협업, 커미션 문의는 이메일로 보내주세요.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-5 inline-block rounded-md bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          {CONTACT_EMAIL}
        </a>
      </section>
    </main>
  );
}
