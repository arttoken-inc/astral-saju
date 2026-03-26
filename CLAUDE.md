# astral-saju 프로젝트

## 개요
청월당(cheongwoldang.com) 클론 프로젝트. 사주/운세 서비스 플랫폼.

## 기술 스택
- Next.js 16 + TypeScript + Tailwind CSS 4 + Bun
- Swiper (캐러셀)
- Auth.js v5 (next-auth) + Google OAuth
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
- `wrangler.jsonc` - Cloudflare Workers 배포 설정

## 현재 상태 (2026-03-26)
### 완료
- 랜딩페이지 클론 (원본과 동일)
- 청월아씨 정통사주 전체 플로우 (히어로→입력→결과→결제유도)
- JSON 기반 서비스 아키텍처 리팩토링
- 하단 고정 결제 유도 바 (카운트다운 타이머)
- 로그인 페이지 (/auth/login) - Google + 카카오 + 전화번호
- 마이페이지 인증 리다이렉트
- Cloudflare Workers 배포

### TODO
1. Google OAuth 실제 연동 (Google Cloud Console에서 OAuth 클라이언트 생성 필요)
2. 마이페이지 실제 구현 (인증된 브라우저 세션으로 원본 분석 필요)
3. 결제 연동
4. 추가 사주 서비스 (다른 서비스 JSON 작성)

## 개발 규칙
- 웹페이지 클론 시 원본과 완벽히 동일하게 (Playwright로 CSS 추출)
- 원본 CDN 이미지 직접 참조 OK
- 스크린샷 비교로 차이점 반복 수정 (bun run compare)
- 서비스별 라우트 폴더 유지 (동적 라우트 X)
- Python은 uv 사용 (pip 금지)
