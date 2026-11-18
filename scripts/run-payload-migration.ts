import { migrateSanityBackup } from "./migrate-sanity-to-payload";

async function main() {
  console.log("Starting Payload-to-Cloudinary media backfill...");
  const keepAlive = setInterval(() => console.log("Media backfill is still running..."), 15_000);
  try {
    const report = await migrateSanityBackup();
    console.log(JSON.stringify(report, null, 2));
  } finally {
    clearInterval(keepAlive);
  }
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});