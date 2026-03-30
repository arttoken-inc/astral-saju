#!/bin/bash
# Migrate landing page images to R2
set -uo pipefail

BUCKET="astral-saju-cdn"
CDN="https://cdn.aifortunedoctor.com"
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

# All missing landing page image paths
PATHS=(
  # Carousel (7 slugs x 6 variants)
  "main/carousel/redlove/bg-pc.png"
  "main/carousel/redlove/bg-tablet.png"
  "main/carousel/redlove/bg-mobile.png"
  "main/carousel/redlove/text-pc.png"
  "main/carousel/redlove/text-tablet.png"
  "main/carousel/redlove/text-mobile.png"
  "main/carousel/newyearmoongirl/bg-pc.png"
  "main/carousel/newyearmoongirl/bg-tablet.png"
  "main/carousel/newyearmoongirl/bg-mobile.png"
  "main/carousel/newyearmoongirl/text-pc.png"
  "main/carousel/newyearmoongirl/text-tablet.png"
  "main/carousel/newyearmoongirl/text-mobile.png"
  "main/carousel/children/bg-pc.png"
  "main/carousel/children/bg-tablet.png"
  "main/carousel/children/bg-mobile.png"
  "main/carousel/children/text-pc.png"
  "main/carousel/children/text-tablet.png"
  "main/carousel/children/text-mobile.png"
  "main/carousel/redlotuslady/bg-pc.png"
  "main/carousel/redlotuslady/bg-tablet.png"
  "main/carousel/redlotuslady/bg-mobile.png"
  "main/carousel/redlotuslady/text-pc.png"
  "main/carousel/redlotuslady/text-tablet.png"
  "main/carousel/redlotuslady/text-mobile.png"
  "main/carousel/bluemoonlady/bg-pc.png"
  "main/carousel/bluemoonlady/bg-tablet.png"
  "main/carousel/bluemoonlady/bg-mobile.png"
  "main/carousel/bluemoonlady/text-pc.png"
  "main/carousel/bluemoonlady/text-tablet.png"
  "main/carousel/bluemoonlady/text-mobile.png"
  "main/carousel/loveagain/bg-pc.png"
  "main/carousel/loveagain/bg-tablet.png"
  "main/carousel/loveagain/bg-mobile.png"
  "main/carousel/loveagain/text-pc.png"
  "main/carousel/loveagain/text-tablet.png"
  "main/carousel/loveagain/text-mobile.png"
  "main/carousel/money/bg-pc.png"
  "main/carousel/money/bg-tablet.png"
  "main/carousel/money/bg-mobile.png"
  "main/carousel/money/text-pc.png"
  "main/carousel/money/text-tablet.png"
  "main/carousel/money/text-mobile.png"

  # Best cards
  "main/basic/children.png"
  "main/signature/redlove.png"
  "main/signature/blue-moon-lady.png"
  "main/signature/red-lotus-lady.png"

  # Replay
  "main/replay/replay_mobile.png"
  "main/replay/replay_pc.png"

  # Fortune cards
  "main/signature/new-year-moon-girl.png"
  "main/signature/facepast_251202.png"
  "main/signature/dream-girl.png"
  "main/basic/love-type.png"
  "main/basic/chinese-recommend.png"
  "main/basic/name-analysis.png"
  "main/basic/amulet.png"
  "main/basic/naming.png"
  "main/basic/today.png"

  # Promo video
  "main/popup/video_popup_sketch.webm"
)

# Uploads paths (different CDN base path)
UPLOAD_PATHS=(
  "uploads/admin/dev/banner/home-main/20260211/4e768100-10f6-4e1b-836a-443005285194.png"
  "uploads/admin/dev/banner/home-main/20260107/4606c74b-71c8-49ed-a1d7-afcaf74f3b20.png"
  "uploads/admin/dev/banner/home-main/20251223/ed775e29-ecbf-469a-a1c1-8c08d8049c71.png"
  "uploads/admin/live/banner/home-main/20260109/ce4b25f4-aa7d-4c28-8b61-41ae1a01f5df.png"
  "uploads/celebrities/%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD%2016%EA%B0%95%20%EC%97%B0%ED%9E%88.webp"
  "uploads/celebrities/%EB%B0%95%EC%99%95%EC%97%B4.webp"
  "uploads/celebrities/%EB%B0%95%EC%A7%80%ED%9B%88.webp"
)

SUCCESS=0
FAIL=0

echo "=== Migrating landing images to R2 ==="

for P in "${PATHS[@]}"; do
  URL="$CDN/web/live/current/images/$P"
  LOCALFILE="$TMPDIR/$P"
  mkdir -p "$(dirname "$LOCALFILE")"

  echo -n "  $P ... "
  if curl -sfL "$URL" -o "$LOCALFILE" 2>/dev/null; then
    OUTPUT=$(bunx wrangler r2 object put "$BUCKET/$P" --file="$LOCALFILE" --remote 2>&1)
    if echo "$OUTPUT" | grep -q "Upload complete"; then
      echo "OK"
      ((SUCCESS++))
    else
      echo "UPLOAD FAIL"
      ((FAIL++))
    fi
  else
    echo "DOWNLOAD FAIL"
    ((FAIL++))
  fi
done

for P in "${UPLOAD_PATHS[@]}"; do
  URL="$CDN/$P"
  # Decode for local file path
  DECODED=$(printf '%b' "${P//%/\\x}")
  LOCALFILE="$TMPDIR/$DECODED"
  mkdir -p "$(dirname "$LOCALFILE")"

  echo -n "  $P ... "
  if curl -sfL "$URL" -o "$LOCALFILE" 2>/dev/null; then
    OUTPUT=$(bunx wrangler r2 object put "$BUCKET/$P" --file="$LOCALFILE" --remote 2>&1)
    if echo "$OUTPUT" | grep -q "Upload complete"; then
      echo "OK"
      ((SUCCESS++))
    else
      echo "UPLOAD FAIL"
      ((FAIL++))
    fi
  else
    echo "DOWNLOAD FAIL"
    ((FAIL++))
  fi
done

echo "=== Done: $SUCCESS succeeded, $FAIL failed ==="
