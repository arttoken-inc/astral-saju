const CDN = "https://cdn.aifortunedoctor.com";
const BASE = `${CDN}/web/live/current/images/s/bluemoonladysaju`;

// 스텝 배경 이미지
export const stepImages = {
  homeVideo: `${BASE}/main/video/main_video.mp4?v=20260119`,
  homePoster: `${BASE}/main/step_home.png?v=20260119`,
  homeTitle: `${BASE}/main/step_home_title.png?v=20260119`,
  intro: `${BASE}/main/step_intro.png`,
  info: `${BASE}/main/step_info.png`,
  middle: `${BASE}/main/step_middle.png`,
  step1: `${BASE}/main/step_1.png`,
  step2: `${BASE}/main/step_2.png`,
};

// 결과 이미지
export const resultImages = Array.from({ length: 19 }, (_, i) => {
  const suffix =
    i === 7 || i === 17 ? "?v=20260114" : i === 10 ? "_251024" : "";
  const name = i === 10 ? `result_10${suffix}` : `result_${i}${suffix}`;
  return `${BASE}/result/${name}.png`;
});

// result_10은 특수 이름
resultImages[10] = `${BASE}/result/result_10_251024.png`;

export const resultBubbleImages = [
  `${BASE}/result/result_bubble_0.png`,
  `${BASE}/result/result_bubble_1.png`,
  `${BASE}/result/result_bubble_2.png`,
  `${BASE}/result/result_bubble_3.png`,
];

export const resultHyundaiImages = [
  `${BASE}/result/result_hyundai_1.png`,
  `${BASE}/result/result_hyundai_2.png`,
];

// 데코레이션
export const decorations = {
  leftCloud: `${CDN}/web/live/current/images/decorations/border_left_cloud_decoration.png`,
  rightCloud: `${CDN}/web/live/current/images/decorations/border_right_cloud_decoration.png`,
  fiveCircle: `${CDN}/web/live/current/images/components/saju/fivecircle/five-circle.png`,
  fiveCircleLegend: `${CDN}/web/live/current/images/components/saju/fivecircle/five-circle-legend.png`,
  strengthDiagram: `${CDN}/web/live/current/images/components/saju/fivecircle/details/strength-diagram.png`,
  maskedWealthGraph: `${BASE}/result/masked-wealth-graph.png`,
  dreamPerson: `${CDN}/web/live/current/images/components/day_person/romance/best/masked/FEMALE_%EC%9D%84_%EC%8B%A0%EA%B0%95.png`,
};

// 한자 이미지
export function kanjiImg(char: string) {
  return `${CDN}/web/live/current/images/moonlight/kanji/${encodeURIComponent(char)}.png`;
}

// 용신 이미지
export function yongsinImg(name: string) {
  return `${CDN}/web/live/current/images/components/saju/fivecircle/details/${encodeURIComponent(name)}.png`;
}

// 시간 옵션
export const timeOptions = [
  { value: "", label: "태어난 시간을 선택해주세요.", disabled: true },
  { value: "unknown", label: "시간 모름" },
  { value: "joja", label: "조자/朝子 (00:00~01:29)" },
  { value: "chuk", label: "축/丑 (01:30~03:29)" },
  { value: "in", label: "인/寅 (03:30~05:29)" },
  { value: "myo", label: "묘/卯 (05:30~07:29)" },
  { value: "jin", label: "진/辰 (07:30~09:29)" },
  { value: "sa", label: "사/巳 (09:30~11:29)" },
  { value: "oh", label: "오/午 (11:30~13:29)" },
  { value: "mi", label: "미/未 (13:30~15:29)" },
  { value: "shin", label: "신/申 (15:30~17:29)" },
  { value: "yu", label: "유/酉 (17:30~19:29)" },
  { value: "sul", label: "술/戌 (19:30~21:29)" },
  { value: "hae", label: "해/亥 (21:30~23:29)" },
  { value: "yaja", label: "야자/夜子 (23:30~23:59)" },
];

// 사주 결과 데이터 (김민수 1990.05.15 午시 남성)
export const sajuResult = {
  name: "김민수",
  nameShort: "민수",
  birthDate: "1990년 5월 15일",
  birthTime: "午",
  cheongan: ["壬", "庚", "辛", "庚"] as const, // 시 일 월 년
  jiji: ["午", "辰", "巳", "午"] as const,
  sipseongTop: [
    { hanja: "食神", hangul: "식신" },
    { hanja: "日干", hangul: "일간" },
    { hanja: "劫財", hangul: "겁재" },
    { hanja: "比肩", hangul: "비견" },
  ],
  sipseongBottom: [
    { hanja: "正官", hangul: "정관" },
    { hanja: "偏印", hangul: "편인" },
    { hanja: "偏官", hangul: "편관" },
    { hanja: "正官", hangul: "정관" },
  ],
  sibiUnseong: [
    { hanja: "沐浴", hangul: "목욕" },
    { hanja: "養", hangul: "양" },
    { hanja: "長生", hangul: "장생" },
    { hanja: "沐浴", hangul: "목욕" },
  ],
  sinsal: [
    { hanja: "災殺", hangul: "재살" },
    { hanja: "華蓋殺", hangul: "화개살" },
    { hanja: "劫殺", hangul: "겁살" },
    { hanja: "災殺", hangul: "재살" },
  ],
  guin: [
    "(없음)",
    "月德(월덕귀인)",
    "學堂(학당귀인)\n文曲(문곡귀인)",
    "月德(월덕귀인)",
  ],
};

export const daeunTable = {
  years: [1996, 2006, 2016, 2026, 2036, 2046, 2056],
  ages: [7, 17, 27, 37, 47, 57, 67],
  startAge: 7,
  cycle: 10,
};

export const ohaengData = {
  distribution: [0, 3, 1, 3, 1], // 木 火 土 金 水
  ratio: [
    { name: "목", hanja: "木", value: 0.0, status: "결핍", color: "rgb(34, 144, 150)" },
    { name: "화", hanja: "火", value: 50.0, status: "과다", color: "rgb(204, 58, 58)" },
    { name: "토", hanja: "土", value: 13.6, status: "적정", color: "rgb(210, 174, 44)" },
    { name: "금", hanja: "金", value: 27.3, status: "발달", color: "rgb(117, 117, 117)" },
    { name: "수", hanja: "水", value: 9.1, status: "부족", color: "rgb(57, 57, 57)" },
  ],
  yongshin: { name: "토", img: "토" },
  heeshin: { name: "금", img: "금" },
  gishin: { name: "목", img: "목" },
  strength: { ilgan: "경", level: "신약" },
};

export const destinyPartner = {
  job: "디자인·브랜딩",
  appearance: ["165cm", "길고가는목", "감성적인분위기"],
  personality: ["섬세함", "따뜻함"],
  traits: ["분위기있는대화", "고민잘들어줌"],
};

export const crisisList = [
  "믿었던 친구의 배신",
  "예기치 못한 사고",
  "잦은 이사와 직장 이동",
  "더 많은 위기를 확인하고 싶으면 복채가 필요해요.",
  "확인하기 위해 복채가 필요한 위기에요.",
];
