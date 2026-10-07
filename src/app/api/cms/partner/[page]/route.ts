import { NextResponse } from "next/server";
import { sanityClient } from "@/sanity/lib/client";

const documentIds = { community: "evrs-community", corporate: "evrs-corporate" } as const;
export async function GET(_: Request, { params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const id = documentIds[page as keyof typeof documentIds];
  if (!id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const content = await sanityClient.fetch(`*[_type == "partnerLandingPage" && _id == $id][0]{
    pageName, seo,
    navbar{"logo":logo.asset->url,logoHref,links[]{label,href},cta,ctaLong,ctaHref},
    hero{eyebrow,title,body,cta,ctaHref,secondaryCta,secondaryCtaHref,"image":image.asset->url},
    invitation{eyebrow,title,body,scrollCue,statementEyebrow,statementLine1,statementLine2,statementLine3,"image":image.asset->url},
    season{eyebrow,title,body,raceLabel,medalLabel,endCard{title,body,cta,ctaHref},races[]{key,name,emirate,date,meaning,color,"icon":icon.asset->url,"image":image.asset->url}},
    raceDay{eyebrow,title,body,"image":image.asset->url,distances[]{distance,tabLabel,tabCaption,tagline,description,laps,"image":image.asset->url}},
    medal{eyebrow,title,body,cta,"image":image.asset->url},
    numbers{eyebrow,title,cards[]{value,unit,label,countTo,format,dots}}, partnership{eyebrow,title,footer,leftTitle,leftItems[]{title,description,channels},rightTitle,rightItems[]{text,subtext}},
    moment{eyebrow,title,body,"image":image.asset->url,pileImages[]{"image":image.asset->url,caption,color,wide}}, join{eyebrow,title,body,"image":image.asset->url,form{title,organisationLabel,nameLabel,emailLabel,phoneLabel,phonePlaceholder,sizeLabel,villagesLabel,raceOptions,noteLabel,submitLabel,finePrint,successTitle,successMessage}}
  }`, { id });
  return NextResponse.json(content ?? null, { headers: { "Cache-Control": "no-store" } });
}