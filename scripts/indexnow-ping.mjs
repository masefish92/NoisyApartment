#!/usr/bin/env node
/**
 * Notifies Bing/Yandex/other IndexNow-participating search engines that the
 * site has changed, by POSTing every URL currently in the live sitemap.xml
 * to api.indexnow.org. Run manually after a deploy (there's no CI pipeline
 * in this repo — deploys are manual via `npx vercel --prod`, see CLAUDE.md),
 * same pattern as `npm run seo:audit` / `npm run schema:validate`.
 *
 * Requires the key file to already be live at
 * https://noisyapartment.org/<INDEXNOW_KEY>.txt (see public/<key>.txt) —
 * IndexNow verifies ownership by fetching that file before accepting pings.
 */
const BASE_URL = "https://noisyapartment.org";
const INDEXNOW_KEY = "562dca0ad3e2a2e414f8ca04c5275e39";

async function getSitemapUrls() {
  const res = await fetch(`${BASE_URL}/sitemap.xml`);
  if (!res.ok) throw new Error(`Failed to fetch sitemap.xml: ${res.status}`);
  const xml = await res.text();
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
  return matches.map((m) => m[1]);
}

async function main() {
  const urlList = await getSitemapUrls();
  console.log(`Pinging IndexNow with ${urlList.length} URLs from the live sitemap...`);

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: "noisyapartment.org",
      key: INDEXNOW_KEY,
      keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
      urlList,
    }),
  });

  if (res.ok) {
    console.log(`IndexNow accepted the submission (status ${res.status}).`);
  } else {
    const body = await res.text().catch(() => "");
    console.error(`IndexNow submission failed: ${res.status} ${res.statusText}\n${body}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
