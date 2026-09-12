// Standalone asset export utility uses Node CommonJS.
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs/promises");
const path = require("node:path");
(async () => {
  const assets = JSON.parse(
    await fs.readFile("scripts/figma-assets.json", "utf8"),
  );
  await Promise.all(
    assets.map(async (asset) => {
      const res = await fetch(asset.url);
      if (!res.ok) throw new Error(asset.path + ": " + res.status);
      const bytes = Buffer.from(await res.arrayBuffer());
      await fs.writeFile(path.join("public", asset.path), bytes);
      console.log(asset.path + " " + bytes.length);
    }),
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
