# astral-saju 프로젝트

## 개요
청월당(cheongwoldang.com) 클론 프로젝트. 사주/운세 서비스 플랫폼.

## 기술 스택
- Next.js 16 + TypeScript + Tailwind CSS 4 + Bun
- Swiper (캐러셀)
- Auth.js v5 (next-auth) + Google OAuth
- Anthropic Claude API (Haiku 4.5) — 유료 사주 AI 텍스트 생성
- Cloudflare Workers 배포 (@opennextjs/cloudflare)

## 배포
- **URL**: https://astral-saju.arttokendev.workers.dev
- **Cloudflare 계정**: Arttokendev@gmail.com (account_id: ca4daa80914d0e682e1195712a660a20)
- **GitHub**: arttoken-inc/astral-saju (ethan-arttoken 계정)
- **배포 명령**: `bun run cf:build && bun run cf:deploy`

## 아키텍처
- 사주 서비스는 JSON 기반 (src/data/services/*.json)
- 새 서비스 = JSON 1개 + 라우트 폴더 3파일
- ServiceStepPage: JSON steps → 입력 UI 렌더링
- ServiceResultPage: JSON sections → 결과 UI 렌더링

## 핵심 파일
- `src/auth.ts` - Auth.js 설정 (Google OAuth)
- `src/middleware.ts` - 인증 미들웨어 (/mypage 보호)
- `src/lib/serviceConfig.ts` - 서비스 설정 TypeScript 타입
- `src/data/services/bluemoonladysaju.json` - 청월아씨 정통사주 설정
- `src/components/saju/ServiceStepPage.tsx` - 스텝 렌더링 엔진
- `src/components/saju/ServiceResultPage.tsx` - 결과 렌더링 엔진
- `src/components/saju/PaidResultPage.tsx` - 유료 결과 웹툰 (AI 텍스트 연동)
- `src/lib/llm/anthropic.ts` - Anthropic API fetch 어댑터 (SDK 미사용, CF Workers 호환)
- `src/lib/llm/promptBuilder.ts` - 유료 분석 프롬프트 빌더 + JSON 응답 파서
- `src/lib/llm/types.ts` - LLM 관련 타입 (AiTextOutput 14개 키)
- `src/app/api/orders/[id]/generate-ai/route.ts` - AI 텍스트 생성 API (캐시 + sentinel 동시요청 방어)
- `wrangler.jsonc` - Cloudflare Workers 배포 설정

## 현재 상태 (2026-04-14)
### 완료
- 랜딩페이지 클론 (원본과 동일, 히어로 캐러셀 카드 이펙트 포함)
- 청월아씨 정통사주 전체 플로우 (히어로→입력→결과→결제유도)
- JSON 기반 서비스 아키텍처 리팩토링
- 하단 고정 결제 유도 바 (카운트다운 타이머)
- 로그인 페이지 (/auth/login) - Google + 카카오 + 전화번호
- Google OAuth 실제 연동 (Auth.js v5 + Google Cloud Console 클라이언트)
- 마이페이지 구현 (프로필 표시/편집, 사주 뱃지 자동계산, 보관함 링크)
- Cloudflare D1 데이터베이스 (users, orders, saju_results, ai_texts 테이블)
- 유저 프로필 시스템 (생년월일, 태어난 시각, 성별, 음력/양력)
- 보관함/리플레이 페이지 (과거 사주 분석 결과 목록)
- 오행 분석 (110점 알고리즘, 용신/희신/기신, 강도 다이어그램)
- 결제 백엔드 인프라 (주문 생성/조회, 결과 저장 API)
- 로딩 UX 개선 (이미지 프리로딩, 포스터→비디오 크로스페이드, 로딩 스피너)
- LLM 연동 — 유료 결과 웹툰 14개 챕터 AI 텍스트 생성 (Anthropic Haiku 4.5)
- Cloudflare Workers 배포

### TODO
1. 결제 게이트웨이 연동 (Bootpay/Stripe 등 실제 PG사 결제)
2. 추가 사주 서비스 (다른 서비스 JSON 작성)
3. D1 마이그레이션 적용 (wrangler d1 execute --remote) + wrangler secret put ANTHROPIC_API_KEY

## LLM 연동 아키텍처
- 유료 결과 페이지 첫 조회 시 AI 텍스트 생성, D1에 캐시 (이후 즉시 반환)
- 흐름: PaidResultPage → POST /api/orders/[id]/generate-ai → 캐시 확인 → LLM 호출 → D1 저장
- 모델: Claude Haiku 4.5 (비용 ~$0.03/건, Sonnet 대비 품질 동등 확인 완료)
- 프롬프트: SajuResult + 오행 용신/희신/기신 + 자미두수/별자리 → 14개 aiKey JSON 출력
- 동시요청 방어: sentinel row (INSERT...DO NOTHING) + 202 폴링 (최대 24회 = 2분)
- 환경변수: 로컬 `.env.local` ANTHROPIC_API_KEY / 프로덕션 `wrangler secret`
- 비교 스크립트: `bun scripts/compare-models.ts` (Haiku vs Sonnet 품질/비용 비교)

## 개발 규칙
- 웹페이지 클론 시 원본과 완벽히 동일하게 (Playwright로 CSS 추출)
- 원본 CDN 이미지 직접 참조 OK
- 스크린샷 비교로 차이점 반복 수정 (bun run compare)
- 서비스별 라우트 폴더 유지 (동적 라우트 X)
- Python은 uv 사용 (pip 금지)
