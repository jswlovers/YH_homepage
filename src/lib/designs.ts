export type Design = {
  id: string;
  title: string;
  season: string;
  description: string;
  tags: string[];
  /** public/designs/ 아래 실제 이미지 파일을 넣으면 이 경로로 교체하세요 (예: "/designs/look-01.jpg"). */
  image?: string;
  /** 이미지가 없을 때 카드에 쓰이는 그라디언트 (임시 플레이스홀더). */
  placeholderGradient: string;
};

// 실제 작업물로 교체해 주세요. image를 채우면 사진이, 비워두면 그라디언트 플레이스홀더가 보입니다.
export const designs: Design[] = [
  {
    id: "look-01",
    title: "Untitled Look 01",
    season: "2026 S/S",
    description: "여기에 작품 설명을 적어주세요 — 컨셉, 소재, 영감을 받은 지점 등.",
    tags: ["미니멀", "리넨"],
    placeholderGradient: "from-stone-200 to-stone-400",
  },
  {
    id: "look-02",
    title: "Untitled Look 02",
    season: "2026 S/S",
    description: "여기에 작품 설명을 적어주세요.",
    tags: ["실루엣", "드레이핑"],
    placeholderGradient: "from-rose-100 to-rose-300",
  },
  {
    id: "look-03",
    title: "Untitled Look 03",
    season: "2025 F/W",
    description: "여기에 작품 설명을 적어주세요.",
    tags: ["레이어링", "울"],
    placeholderGradient: "from-slate-200 to-slate-400",
  },
];
