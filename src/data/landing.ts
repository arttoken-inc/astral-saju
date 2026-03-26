const CDN = "https://cdn.aifortunedoctor.com";

export const carouselSlides = [
  { slug: "redlove", href: "/s/redlove", alt: "홍연아씨 연애비책", dark: false },
  { slug: "newyearmoongirl", href: "/s/newyearmoongirl/2026", alt: "월하소녀 신년운세", dark: false },
  { slug: "children", href: "/b/children", alt: "청월아씨 자녀사주", dark: false },
  { slug: "redlotuslady", href: "/s/redlotuslady", alt: "홍연아씨 사주궁합", dark: false },
  { slug: "bluemoonlady", href: "/s/bluemoonladysaju", alt: "청월아씨 정통사주", dark: false },
  { slug: "loveagain", href: "/b/loveagain", alt: "홍연아씨 재회비책", dark: true },
  { slug: "money", href: "/b/money", alt: "청월아씨 재물보감", dark: true },
];

export function carouselBg(slug: string, device: "pc" | "tablet" | "mobile") {
  return `${CDN}/web/live/current/images/main/carousel/${slug}/bg-${device}.png?v=20260325`;
}

export function carouselText(
  slug: string,
  device: "pc" | "tablet" | "mobile"
) {
  return `${CDN}/web/live/current/images/main/carousel/${slug}/text-${device}.png?v=20261223`;
}

export const bestCards = [
  {
    title: "청월아씨 자녀사주",
    desc: "아이 앞에 펼쳐진 운명의 지도",
    href: "/b/children",
    img: `${CDN}/web/live/current/images/main/basic/children.png`,
  },
  {
    title: "홍연아씨 연애비책",
    desc: "곧 만나게 될 당신의 인연은?",
    href: "/s/redlove",
    img: `${CDN}/web/live/current/images/main/signature/redlove.png?v=20261209`,
  },
  {
    title: "청월아씨 정통사주",
    desc: "내 앞에 펼쳐진 운명의 길은?",
    href: "/s/bluemoonladysaju",
    img: `${CDN}/web/live/current/images/main/signature/blue-moon-lady.png?v=20261209`,
  },
  {
    title: "홍연아씨 사주궁합",
    desc: "우리는 운명일까, 우연일까?",
    href: "/s/redlotuslady",
    img: `${CDN}/web/live/current/images/main/signature/red-lotus-lady.png?v=20261209`,
  },
];

export const fortuneCards = [
  {
    title: "월하소녀 신년운세",
    desc: "2026년 다가올 위기와 기회",
    href: "/s/newyearmoongirl/2026",
    img: `${CDN}/web/live/current/images/main/signature/new-year-moon-girl.png?v=20261209`,
  },
  {
    title: "청월아씨 재물보감",
    desc: "상위 1% 부자들의 비밀",
    href: "/b/money",
    img: `${CDN}/uploads/admin/dev/banner/home-main/20260211/4e768100-10f6-4e1b-836a-443005285194.png`,
  },
  {
    title: "명월선생 커리어사주",
    desc: "성공적인 커리어를 위한 가이드북",
    href: "/b/career",
    img: `${CDN}/uploads/admin/dev/banner/home-main/20260107/4606c74b-71c8-49ed-a1d7-afcaf74f3b20.png`,
  },
  {
    title: "홍연아씨 재회비책",
    desc: "나의 재회 가능성은?",
    href: "/b/loveagain",
    img: `${CDN}/uploads/admin/dev/banner/home-main/20251223/ed775e29-ecbf-469a-a1c1-8c08d8049c71.png`,
  },
  {
    title: "청월아씨 수능운세",
    desc: "완벽한 마무리를 위한 수능운세",
    href: "/b/2027-exam-bluemoonlady",
    img: `${CDN}/uploads/admin/live/banner/home-main/20260109/ce4b25f4-aa7d-4c28-8b61-41ae1a01f5df.png`,
  },
  {
    title: "나의 전생",
    desc: "관상으로 보는 나의 전생은?",
    href: "/s/facepast",
    img: `${CDN}/web/live/current/images/main/signature/facepast_251202.png`,
  },
  {
    title: "몽월소녀 꿈해몽",
    desc: "어젯 밤 꿈, 무슨 의미일까?",
    href: "/dream",
    img: `${CDN}/web/live/current/images/main/signature/dream-girl.png`,
  },
  {
    title: "애착유형 테스트",
    desc: "나는 의존적일까, 독립적일까?",
    href: "/tests/attach",
    img: `${CDN}/web/live/current/images/main/basic/love-type.png`,
  },
  {
    title: "운명의 한자",
    desc: "이름 속에 숨은 한자의 비밀",
    href: "/naming/kanji",
    img: `${CDN}/web/live/current/images/main/basic/chinese-recommend.png`,
  },
  {
    title: "이름 풀이",
    desc: "이름이 내 운을 돕고 있을까?",
    href: "/naming/score",
    img: `${CDN}/web/live/current/images/main/basic/name-analysis.png`,
  },
  {
    title: "부적 생성",
    desc: "나의 기운을 담은 단 하나의 부적",
    href: "/amulet",
    img: `${CDN}/web/live/current/images/main/basic/amulet.png`,
  },
  {
    title: "이름 작명",
    desc: "이름으로 여는 인생의 시작",
    href: "/naming",
    img: `${CDN}/web/live/current/images/main/basic/naming.png`,
  },
  {
    title: "오늘의 운세",
    desc: "어떤 하루가 펼쳐질까?",
    href: "/today",
    img: `${CDN}/web/live/current/images/main/basic/today.png`,
  },
];

export const dreamPosts = [
  {
    title: "좋아하는 여자 아기 울음 꿈 해몽 경고 마음 표현 실패 이별 예지몽",
    body: "당신이 꾼 그 꿈은 지금 좋아하는 그 사람과의 관계에 있어서 아주 강력한 흉몽이자 경고를 담고 있어요. 결론부터 냉정하게 말하자면, 당신이 그 여자를 향한 마음을 제대로 표현하지 못하고 방치하다가 결국 다른 사람에게 그녀를 빼앗기거나, 그녀가 당신의 손을 떠나 다른 사람의 도움을 받게 될 것을 암시하는 예지몽이에요.",
    href: "/dream/p/tCJzHy",
  },
  {
    title: "벌레 샤워 흉몽 인간관계 갈등 경고 생리 재물운 변화 암시",
    body: "당신의 이번 꿈은 한마디로 말하자면, 지금 당신이 처한 답답한 상황이 해결되려다가도 예상치 못한 외부의 방해와 갈등 때문에 마음고생을 하게 될 것을 암시하는 주의가 필요한 흉몽에 가까워요.",
    href: "/dream/p/BE6jtJ",
  },
  {
    title: "꿈 해몽 머리카락 자르기 시원함 후회 의미와 운세 변화 전환점 조언",
    body: "당신이 꾼 꿈에서 가장 핵심적인 상징은 바로 '자신의 손으로 머리카락을 잘랐다'는 행위와 그 이후에 찾아온 '시원함과 후회'라는 복합적인 감정이에요.",
    href: "/dream/p/w15Gch",
  },
];

export const celebrities = [
  {
    name: "대한민국 16강 연히",
    title: "대한민국 16강 연히 사주팔자",
    body: "대한민국 16강 연히의 사주팔자 분석 1. 일간(甲목, 갑목) 중심의 성향 분석 연히의 일간은 '갑목'이에요. 갑목은 큰 나무, 즉 울창한 숲의 큰 나무처럼 당당하고, 곧고, 솔직한 성향을 나타내요.",
    img: `${CDN}/uploads/celebrities/%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD%2016%EA%B0%95%20%EC%97%B0%ED%9E%88.webp`,
    href: "/p/c/%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD%2016%EA%B0%95%20%EC%97%B0%ED%9E%88",
  },
  {
    name: "박왕열",
    title: "박왕열 사주팔자",
    body: "박왕열의 사주팔자 분석 1. 일간: 경금(庚) 박왕열의 일간은 경금(庚)으로, 이는 이 사람의 성격과 본질을 나타내요. 경금은 강한 금속과 같은 성질을 가지고 있어요.",
    img: `${CDN}/uploads/celebrities/%EB%B0%95%EC%99%95%EC%97%B4.webp`,
    href: "/p/c/%EB%B0%95%EC%99%95%EC%97%B4",
  },
  {
    name: "박지훈",
    title: "박지훈 사주팔자",
    body: "박지훈 님의 사주팔자는 마치 뜨거운 용광로 속에서 스스로를 정련하여 마침내 아름다운 광채를 내뿜는 '보석'과 같은 형상을 하고 있어요.",
    img: `${CDN}/uploads/celebrities/%EB%B0%95%EC%A7%80%ED%9B%88.webp`,
    href: "/p/c/%EB%B0%95%EC%A7%80%ED%9B%88",
  },
];

export const replayMobileImg = `${CDN}/web/live/current/images/main/replay/replay_mobile.png`;
export const replayPcImg = `${CDN}/web/live/current/images/main/replay/replay_pc.png`;
export const promoVideoSrc = `${CDN}/web/live/current/images/main/popup/video_popup_sketch.webm`;
