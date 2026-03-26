/**
 * 스크린샷 비교 스크립트
 * 사용법: bun run scripts/compare.ts
 *
 * 원본 사이트(cheongwoldang.com)와 로컬 클론(localhost:3000)의
 * 모바일/태블릿/데스크톱 스크린샷을 나란히 저장합니다.
 *
 * 결과: scripts/screenshots/ 폴더에 저장
 */

import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { join } from "path";

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
] as const;

const ORIGINAL_URL = "https://cheongwoldang.com/";
const CLONE_URL = "http://localhost:3000/";
const OUTPUT_DIR = join(import.meta.dir, "screenshots");

async function captureScreenshots() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch();

  for (const vp of VIEWPORTS) {
    console.log(`\n📐 Capturing ${vp.name} (${vp.width}x${vp.height})...`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });

    // 원본
    const originalPage = await context.newPage();
    await originalPage.goto(ORIGINAL_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
    await originalPage.waitForTimeout(5000); // 캐러셀/이미지 로드 대기
    await originalPage.screenshot({
      path: join(OUTPUT_DIR, `original-${vp.name}.png`),
      fullPage: true,
    });
    console.log(`  ✅ original-${vp.name}.png`);

    // 클론
    const clonePage = await context.newPage();
    await clonePage.goto(CLONE_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
    await clonePage.waitForTimeout(3000);
    await clonePage.screenshot({
      path: join(OUTPUT_DIR, `clone-${vp.name}.png`),
      fullPage: true,
    });
    console.log(`  ✅ clone-${vp.name}.png`);

    await context.close();
  }

  await browser.close();

  console.log(`\n🎯 Done! Screenshots saved to: ${OUTPUT_DIR}`);
  console.log("Compare original vs clone side-by-side for each viewport.");
}

captureScreenshots().catch(console.error);
