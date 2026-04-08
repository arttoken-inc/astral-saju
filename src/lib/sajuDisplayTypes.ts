/**
 * 사주 결과 표시용 데이터 타입.
 * SajuTable, DaeunTable, OhaengSection 컴포넌트에서 사용.
 * 실제 데이터는 사주 계산 엔진(saju-engine.ts)에서 생성되어 전달됨.
 */

export interface SipseongItem {
  hanja: string;
  hangul: string;
}

export interface SajuDisplayData {
  name: string;
  nameShort: string;
  birthDate: string;
  birthTime: string;
  cheongan: string[];
  jiji: string[];
  sipseongTop: SipseongItem[];
  sipseongBottom: SipseongItem[];
  sibiUnseong: SipseongItem[];
  sinsal: SipseongItem[];
  guin: string[];
}

export interface OhaengRatio {
  name: string;
  hanja: string;
  value: number;
  status: string;
  color: string;
}

export interface OhaengDisplayData {
  distribution: number[];
  ratio: OhaengRatio[];
  yongshin: { name: string; img: string };
  heeshin: { name: string; img: string };
  gishin: { name: string; img: string };
  strength: { ilgan: string; level: string };
  /** 일간 오행의 ratio 배열 내 인덱스 (0=목,1=화,2=토,3=금,4=수) */
  myElementIndex: number;
}

export interface DaeunDisplayData {
  years: number[];
  ages: number[];
  startAge: number;
  cycle: number;
}

export interface DestinyPartnerDisplayData {
  job: string;
  appearance: string[];
  personality: string[];
  traits: string[];
}
