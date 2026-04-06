export interface CategoryProduct {
  title: string;
  desc: string;
  img: string;
  href: string;
}

export interface CategoryData {
  slug: string;
  label: string;
  title: string;
  products: CategoryProduct[];
}

const CDN = "https://cdn.aifortunedoctor.com";

export const categories: CategoryData[] = [
  {
    slug: "general",
    label: "종합",
    title: "종합 카테고리",
    products: [
      {
        title: "월하소녀 올해의운세",
        desc: "2026년 다가올 위기와 기회",
        img: `${CDN}/uploads/admin/live/banner/home-main/20260403/3667a2e5-5f70-45a9-94fb-fce39024a7a4.png`,
        href: "/s/newyearmoongirl/2026",
      },
      {
        title: "청월아씨 정통사주",
        desc: "내 앞에 펼쳐진 운명의 길은?",
        img: `${CDN}/uploads/admin/live/banner/home-main/20260403/0778d096-8231-4c06-9e89-77280b0afb84.png`,
        href: "/s/bluemoonladysaju",
      },
    ],
  },
  {
    slug: "love",
    label: "연애",
    title: "연애 카테고리",
    products: [
      {
        title: "홍연아씨 연애비책",
        desc: "곧 만나게 될 당신의 인연은?",
        img: `${CDN}/uploads/admin/live/banner/home-main/20260403/3e336630-3a45-4f3d-955d-b1bf2914cfd7.png`,
        href: "/s/redlove",
      },
      {
        title: "홍연아씨 사주궁합",
        desc: "우리는 운명일까, 우연일까?",
        img: `${CDN}/uploads/admin/live/banner/home-main/20260403/61bc0239-08c8-4f50-b36d-ca72bb513aa3.png`,
        href: "/s/redlotuslady",
      },
    ],
  },
  {
    slug: "wealth-career",
    label: "재물/커리어",
    title: "재물/커리어 카테고리",
    products: [
      {
        title: "청월아씨 재물보감",
        desc: "상위 1% 부자들의 비밀",
        img: `${CDN}/uploads/admin/live/banner/home-main/20260403/28f76aa9-52c7-457e-88e7-00122ae882d5.png`,
        href: "/b/money",
      },
      {
        title: "명월선생 커리어사주",
        desc: "성공적인 커리어를 위한 가이드북",
        img: `${CDN}/uploads/admin/live/banner/home-main/20260403/9f2132cc-2362-432e-86be-39bf84c283a5.png`,
        href: "/b/career",
      },
    ],
  },
  {
    slug: "compatibility",
    label: "궁합",
    title: "궁합 카테고리",
    products: [
      {
        title: "청월아씨 자녀사주",
        desc: "아이 앞에 펼쳐진 운명의 지도",
        img: `${CDN}/uploads/admin/live/banner/home-main/20260403/c758a751-8070-4769-8016-6a91cf57e3a3.png`,
        href: "/b/children",
      },
      {
        title: "홍연아씨 재회비책",
        desc: "나의 재회 가능성은?",
        img: `${CDN}/uploads/admin/live/banner/home-main/20260403/13fb4d7e-36d5-42e1-bfda-1281ba47e2d2.png`,
        href: "/b/loveagain",
      },
      {
        title: "홍연아씨 사주궁합",
        desc: "우리는 운명일까, 우연일까?",
        img: `${CDN}/uploads/admin/live/banner/home-main/20260403/61bc0239-08c8-4f50-b36d-ca72bb513aa3.png`,
        href: "/s/redlotuslady",
      },
    ],
  },
  {
    slug: "others",
    label: "기타",
    title: "기타 카테고리",
    products: [
      {
        title: "청월아씨 자녀사주",
        desc: "아이 앞에 펼쳐진 운명의 지도",
        img: `${CDN}/uploads/admin/live/banner/home-main/20260403/c758a751-8070-4769-8016-6a91cf57e3a3.png`,
        href: "/b/children",
      },
      {
        title: "청월아씨 수능운세",
        desc: "완벽한 마무리를 위한 수능운세",
        img: `${CDN}/uploads/admin/live/banner/home-main/20260403/660c44ae-487f-42fa-bc06-58d622a1834b.png`,
        href: "/b/2027-exam-bluemoonlady",
      },
      {
        title: "나의 전생",
        desc: "관상으로 보는 나의 전생은?",
        img: "/images/main/snack_category/facepast.png",
        href: "/s/facepast",
      },
    ],
  },
];

export function getCategoryBySlug(slug: string): CategoryData | undefined {
  return categories.find((c) => c.slug === slug);
}
