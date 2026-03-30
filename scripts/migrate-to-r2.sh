#!/bin/bash
# Migrate images from original CDN to Cloudflare R2
# Usage: bash scripts/migrate-to-r2.sh

set -uo pipefail

BUCKET="astral-saju-cdn"
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

# All CDN URLs used in the codebase
URLS=(
  # cheongwoldang.com
  "https://cheongwoldang.com/logos/logo_with_black_typo.png"

  # cdn.aifortunedoctor.com - auth/login
  "https://cdn.aifortunedoctor.com/web/live/current/images/auth/login/default.png"

  # profile / replay
  "https://cdn.aifortunedoctor.com/web/live/current/images/profile/MALE_을목_신강.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/replay/replay_banner.png"

  # bluemoonladysaju - main steps
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/main/video/main_video.mp4?v=20260119"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/main/step_home.png?v=20260119"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/main/step_home_title.png?v=20260119"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/main/step_intro.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/main/step_info.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/main/step_middle.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/main/step_1.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/main/step_2.png"

  # bluemoonladysaju - results
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/result/result_0.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/result/result_1.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/result/result_2.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/result/result_3.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/result/result_4.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/result/result_5.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/result/result_6.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/result/result_7.png?v=20260114"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/result/result_8.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/result/result_9.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/result/result_10_251024.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/result/result_11.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/result/result_12.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/result/result_13.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/result/result_14.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/result/result_15.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/result/result_16.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/result/result_17.png?v=20260114"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/result/result_18.png"

  # bluemoonladysaju - result bubbles
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/result/result_bubble_0.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/result/result_bubble_1.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/result/result_bubble_2.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/result/result_bubble_3.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/result/result_hyundai_1.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/result/result_hyundai_2.png"

  # decorations & components
  "https://cdn.aifortunedoctor.com/web/live/current/images/decorations/border_left_cloud_decoration.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/decorations/border_right_cloud_decoration.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/components/saju/fivecircle/five-circle.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/components/saju/fivecircle/five-circle-legend.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/components/saju/fivecircle/details/strength-diagram.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/s/bluemoonladysaju/result/masked-wealth-graph.png"
  "https://cdn.aifortunedoctor.com/web/live/current/images/components/day_person/romance/best/masked/FEMALE_%EC%9D%84_%EC%8B%A0%EA%B0%95.png"
)

echo "=== Migrating ${#URLS[@]} assets to R2 bucket: $BUCKET ==="
echo ""

SUCCESS=0
FAIL=0

for URL in "${URLS[@]}"; do
  # Strip query params for the R2 key
  CLEAN_URL="${URL%%\?*}"

  # Derive R2 object key from URL path
  if [[ "$CLEAN_URL" == *"cheongwoldang.com"* ]]; then
    KEY=$(echo "$CLEAN_URL" | sed 's|https://cheongwoldang.com/||')
  else
    KEY=$(echo "$CLEAN_URL" | sed 's|https://cdn.aifortunedoctor.com/web/live/current/images/||')
  fi

  LOCALFILE="$TMPDIR/$KEY"
  mkdir -p "$(dirname "$LOCALFILE")"

  echo -n "  ⬇ Downloading: $KEY ... "
  if curl -sfL "$URL" -o "$LOCALFILE" 2>/dev/null; then
    SIZE=$(stat -c%s "$LOCALFILE" 2>/dev/null || stat -f%z "$LOCALFILE" 2>/dev/null)
    echo "OK ($(numfmt --to=iec "$SIZE" 2>/dev/null || echo "${SIZE}B"))"

    echo -n "  ⬆ Uploading to R2: $KEY ... "
    OUTPUT=$(bunx wrangler r2 object put "$BUCKET/$KEY" --file="$LOCALFILE" --remote 2>&1)
    if echo "$OUTPUT" | grep -q "Upload complete"; then
      echo "OK"
      ((SUCCESS++))
    else
      echo "FAIL"
      ((FAIL++))
    fi
  else
    echo "FAIL (download)"
    ((FAIL++))
  fi
  echo ""
done

echo "=== Done: $SUCCESS succeeded, $FAIL failed ==="
