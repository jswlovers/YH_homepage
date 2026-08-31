import Image from "next/image";
import type { Design } from "@/lib/designs";

export default function DesignCard({ design }: { design: Design }) {
  return (
    <article className="group">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900">
        {design.image ? (
          <Image
            src={design.image}
            alt={design.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            sizes="(min-width: 768px) 33vw, 100vw"
          />
        ) : (
          <div
            className={`h-full w-full bg-gradient-to-br ${design.placeholderGradient} transition duration-300 group-hover:scale-[1.03]`}
          />
        )}
      </div>
      <div className="mt-3">
        <p className="text-xs uppercase tracking-wide text-neutral-500">{design.season}</p>
        <h3 className="font-serif text-lg">{design.title}</h3>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{design.description}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {design.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-neutral-300 px-2 py-0.5 text-xs text-neutral-600 dark:border-neutral-700 dark:text-neutral-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
