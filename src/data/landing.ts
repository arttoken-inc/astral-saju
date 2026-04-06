// ── 히어로 캐러셀 (단일 배너 이미지 + 순위 뱃지) ──

export interface CarouselSlide {
  slug: string;
  href: string;
  alt: string;
  banner: string;       // CDN 상대경로 (단일 배너)
  rankBadge: string;    // 순위 뱃지
}

export const carouselSlides: CarouselSlide[] = [
  {
    slug: "redlove",
    href: "/s/redlove",
    alt: "홍연아씨 연애비책",
    banner: "main/home_carousel/banner/redlove.png",
    rankBadge: "main/home_carousel/rank_badge/1.png?v=2",
  },
  {
    slug: "bluemoonladysaju",
    href: "/s/bluemoonladysaju",
    alt: "청월아씨 정통사주",
    banner: "main/home_carousel/banner/bluemoonladysaju.png?v=2",
    rankBadge: "main/home_carousel/rank_badge/2.png?v=2",
  },
  {
    slug: "moongirl-2026",
    href: "/s/newyearmoongirl/2026",
    alt: "월하소녀 신년운세",
    banner: "main/home_carousel/banner/moongirl-2026.png",
    rankBadge: "main/home_carousel/rank_badge/3.png?v=2",
  },
  {
    slug: "adultlove",
    href: "/b/adultlove",
    alt: "은휘의 29금 절정비책",
    banner: "main/home_carousel/banner/adultlove.png",
    rankBadge: "main/home_carousel/rank_badge/4.png?v=2",
  },
  {
    slug: "redlotuslady",
    href: "/s/redlotuslady",
    alt: "홍연아씨 사주궁합",
    banner: "main/home_carousel/banner/redlotuslady.png",
    rankBadge: "main/home_carousel/rank_badge/5.png?v=2",
  },
];

// ── 맞춤 추천 섹션 ("어라, 이거 내 얘긴데?!") ──

export interface RecommendCard {
  title: string;
  href: string;
  img: string;
}

export const recommendCards: RecommendCard[] = [
  { title: "홍연아씨 연애비책", href: "/s/redlove", img: "uploads/admin/live/banner/home-main/20260403/3e336630-3a45-4f3d-955d-b1bf2914cfd7.png" },
  { title: "홍연아씨 재회비책", href: "/b/loveagain", img: "uploads/admin/live/banner/home-main/20260403/13fb4d7e-36d5-42e1-bfda-1281ba47e2d2.png" },
  { title: "홍연아씨 사주궁합", href: "/s/redlotuslady", img: "uploads/admin/live/banner/home-main/20260403/61bc0239-08c8-4f50-b36d-ca72bb513aa3.png" },
  { title: "월하소녀 올해의운세", href: "/s/newyearmoongirl/2026", img: "uploads/admin/live/banner/home-main/20260403/3667a2e5-5f70-45a9-94fb-fce39024a7a4.png" },
  { title: "명월선생 커리어사주", href: "/b/career", img: "uploads/admin/live/banner/home-main/20260403/9f2132cc-2362-432e-86be-39bf84c283a5.png" },
  { title: "청월아씨 재물보감", href: "/b/money", img: "uploads/admin/live/banner/home-main/20260403/28f76aa9-52c7-457e-88e7-00122ae882d5.png" },
];

// ── 테마별 카테고리 섹션 ──

export interface CategoryCard {
  title: string;
  desc: string;
  href: string;
  img: string;
}

export interface CategorySection {
  emoji: string;
  heading: string;
  cards: CategoryCard[];
}

export const categorySections: CategorySection[] = [
  {
    emoji: "💌",
    heading: "썸, 연애, 재회.. 일단 들어와 봐요",
    cards: [
      { title: "홍연아씨 사주궁합", desc: "우리는 운명일까, 우연일까?", href: "/s/redlotuslady", img: "uploads/admin/live/banner/home-main/20260403/61bc0239-08c8-4f50-b36d-ca72bb513aa3.png" },
      { title: "은휘의 29금 절정비책", desc: "내 사주 속 쾌락과 유혹의 비밀", href: "/b/adultlove", img: "uploads/admin/live/banner/home-main/20260403/4ef01bba-8056-4af5-92cc-267b0bc0eb16.png" },
      { title: "홍연아씨 연애비책", desc: "곧 만나게 될 당신의 인연은?", href: "/s/redlove", img: "uploads/admin/live/banner/home-main/20260403/3e336630-3a45-4f3d-955d-b1bf2914cfd7.png" },
      { title: "홍연아씨 재회비책", desc: "나의 재회 가능성은?", href: "/b/loveagain", img: "uploads/admin/live/banner/home-main/20260403/13fb4d7e-36d5-42e1-bfda-1281ba47e2d2.png" },
    ],
  },
  {
    emoji: "🔥",
    heading: "따끈한 신상 운세 들어왔어요",
    cards: [
      { title: "은휘의 29금 절정비책", desc: "내 사주 속 쾌락과 유혹의 비밀", href: "/b/adultlove", img: "uploads/admin/live/banner/home-main/20260403/4ef01bba-8056-4af5-92cc-267b0bc0eb16.png" },
      { title: "청월아씨 자녀사주", desc: "아이 앞에 펼쳐진 운명의 지도", href: "/b/children", img: "uploads/admin/live/banner/home-main/20260403/c758a751-8070-4769-8016-6a91cf57e3a3.png" },
      { title: "청월아씨 재물보감", desc: "상위 1% 부자들의 비밀", href: "/b/money", img: "uploads/admin/live/banner/home-main/20260403/28f76aa9-52c7-457e-88e7-00122ae882d5.png" },
    ],
  },
  {
    emoji: "🔓",
    heading: "내 인생, 미리보기 하고싶다면?",
    cards: [
      { title: "청월아씨 정통사주", desc: "내 앞에 펼쳐진 운명의 길은?", href: "/s/bluemoonladysaju", img: "uploads/admin/live/banner/home-main/20260403/0778d096-8231-4c06-9e89-77280b0afb84.png" },
      { title: "월하소녀 올해의운세", desc: "2026년 다가올 위기와 기회", href: "/s/newyearmoongirl/2026", img: "uploads/admin/live/banner/home-main/20260403/3667a2e5-5f70-45a9-94fb-fce39024a7a4.png" },
    ],
  },
  {
    emoji: "💸",
    heading: "나도 상위 1% 가능하다고?",
    cards: [
      { title: "명월선생 커리어사주", desc: "성공적인 커리어를 위한 가이드북", href: "/b/career", img: "uploads/admin/live/banner/home-main/20260403/9f2132cc-2362-432e-86be-39bf84c283a5.png" },
      { title: "청월아씨 재물보감", desc: "상위 1% 부자들의 비밀", href: "/b/money", img: "uploads/admin/live/banner/home-main/20260403/28f76aa9-52c7-457e-88e7-00122ae882d5.png" },
      { title: "청월아씨 수능운세", desc: "완벽한 마무리를 위한 수능운세", href: "/b/2027-exam-bluemoonlady", img: "uploads/admin/live/banner/home-main/20260330/660c44ae-487f-42fa-bc06-58d622a1834b.png" },
    ],
  },
  {
    emoji: "😏",
    heading: "뭘 좋아하실지 몰라 다 준비했어요!",
    cards: [
      { title: "이름 작명", desc: "이름으로 여는 인생의 시작", href: "/naming", img: "main/legacy_chargeable/naming.png" },
      { title: "이름 풀이", desc: "이름이 내 운을 돕고 있을까?", href: "/naming/score", img: "main/legacy_chargeable/name-analysis.png?v=2" },
      { title: "운명의 한자", desc: "이름 속에 숨은 한자의 비밀", href: "/naming/kanji", img: "main/legacy_chargeable/chinese-recommend.png" },
    ],
  },
];

// ── 스낵사주 ("심심할 때는? 5분 순삭 스낵사주") ──

export interface SnackCard {
  title: string;
  desc: string;
  href: string;
  img: string;
}

export const snackCards: SnackCard[] = [
  { title: "몽월소녀 꿈해몽", desc: "어젯 밤 꿈, 무슨 의미일까?", href: "/dream", img: "main/snack_category/dream-girl.png" },
  { title: "나의 전생", desc: "관상으로 보는 나의 전생은?", href: "/s/facepast", img: "main/snack_category/facepast.png" },
  { title: "오늘의 운세", desc: "어떤 하루가 펼쳐질까?", href: "/today", img: "main/snack_category/today.png" },
  { title: "애착유형 테스트", desc: "나는 의존적일까, 독립적일까?", href: "/tests/attach", img: "main/snack_category/love-type.png?v=2" },
  { title: "부적 생성", desc: "나의 기운을 담은 단 하나의 부적", href: "/amulet", img: "main/snack_category/amulet.png" },
];

// ── 매거진 (유명인 사주 / 꿈해몽) ──

export interface CelebrityPost {
  name: string;
  desc: string;
  img: string;
  href: string;
}

export const celebrities: CelebrityPost[] = [
  {
    name: "대한민국 16강 연히",
    desc: "유튜버, 액체 괴물 만들기부터 시작해...",
    img: "uploads/celebrities/%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD%2016%EA%B0%95%20%EC%97%B0%ED%9E%88.webp",
    href: "/p/c/%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD%2016%EA%B0%95%20%EC%97%B0%ED%9E%88",
  },
  {
    name: "장릉혁",
    desc: "중국의 배우, 모델",
    img: "uploads/celebrities/%EC%9E%A5%EB%A6%89%ED%98%81.webp",
    href: "/p/c/%EC%9E%A5%EB%A6%89%ED%98%81",
  },
  {
    name: "딘딘",
    desc: "래퍼 겸 방송인",
    img: "uploads/celebrities/%EB%94%98%EB%94%98.webp",
    href: "/p/c/%EB%94%98%EB%94%98",
  },
];

export interface DreamPost {
  title: string;
  body: string;
  href: string;
}

export const dreamPosts: DreamPost[] = [
  {
    title: "좋아하는 여자 아기 울음 꿈 해몽 경고 마음 표현 실패 이별 예지몽",
    body: "당신이 꾼 그 꿈은 지금 좋아하는 그 사람과의 관계에 있어서 아주 강력한 흉몽이자 경고를 담고 있어요.",
    href: "/dream/p/tCJzHy",
  },
  {
    title: "벌레 샤워 흉몽 인간관계 갈등 경고 생리 재물운 변화 암시",
    body: "당신의 이번 꿈은 한마디로 말하자면, 지금 당신이 처한 답답한 상황이 해결되려다가도 예상치 못한 방해 때문에 마음고생을 하게 될 것을 암시해요.",
    href: "/dream/p/BE6jtJ",
  },
  {
    title: "꿈 해몽 머리카락 자르기 시원함 후회 의미와 운세 변화 전환점 조언",
    body: "당신이 꾼 꿈에서 가장 핵심적인 상징은 바로 '자신의 손으로 머리카락을 잘랐다'는 행위와 그 이후에 찾아온 복합적인 감정이에요.",
    href: "/dream/p/w15Gch",
  },
];

// ── 프로모 비디오 ──

export const promoVideoSrc = "main/popup/video_popup_sketch.webm";
