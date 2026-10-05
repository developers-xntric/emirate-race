import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";
import { homeData } from "../src/data/home-data";
import { arabicData } from "../src/data/home-data/arabic-index";

for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^"|"$/g, "");
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

const bilingual = (name: string, en: string, ar: string) => ({
  [`${name}En`]: en,
  [`${name}Ar`]: ar,
});

async function image(path: string) {
  const asset = await client.assets.upload("image", readFileSync(`public${path}`), {
    filename: path.split("/").pop(),
  });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

async function seedSevenPieceMedal() {
  const en = homeData.sevenPieceMedal;
  const ar = arabicData.sevenPieceMedal;
  await client
    .patch("home")
    .set({
      sevenPieceMedal: {
        sectionName: "Seven-Piece Medal",
        ...bilingual("eyebrow", en.eyebrow, ar.eyebrow),
        ...bilingual("title", en.title, ar.title),
        ...bilingual("description", en.description, ar.description),
        ...bilingual("piecesCollected", en.piecesCollected, ar.piecesCollected),
        ...bilingual("fullMedalUnlocked", en.fullMedalUnlocked, ar.fullMedalUnlocked),
        ...bilingual("runWholeSeason", en.runWholeSeason, ar.runWholeSeason),
        ...bilingual("collectingSeason", en.collectingSeason, ar.collectingSeason),
        ...bilingual("reset", en.reset, ar.reset),
        ...bilingual("medalMarkAlt", en.medalMarkAlt, ar.medalMarkAlt),
        ...bilingual("piecesLabel", en.piecesLabel, ar.piecesLabel),
        ...bilingual("pieceAltSuffix", en.pieceAltSuffix, ar.pieceAltSuffix),
        items: await Promise.all(en.pieces.map(async (piece, index) => ({ _key: `piece-${index}`, ...bilingual("title", piece.name, ar.pieces[index]?.name ?? piece.name), image: await image(piece.image) }))),
        completedImage: await image(en.completedImage),
        ...bilingual("completedImageAlt", en.completedImageAlt, ar.completedImageAlt),
        ...bilingual("unlocked", en.unlocked, ar.unlocked),
        ...bilingual("completedTitle", en.completedTitle, ar.completedTitle),
        ...bilingual("completedDescription", en.completedDescription, ar.completedDescription),
      },
    })
    .commit();
}

seedSevenPieceMedal()
  .then(() => console.log("Seven Piece Medal CMS section seeded."))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });