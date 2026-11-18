# EVRS Payload CMS migration workflow

Last updated: 18 November 2026

## Target

Replace the active Sanity CMS integration with Payload CMS while preserving the existing EVRS routes, visual design, spacing, colours, responsive behaviour, English/Arabic content, SEO, form behaviour, images, videos, downloads, and default frontend data.

Editorial rules:

- Every translated field is ordered English first, then Arabic.
- Images, videos, and downloads are one shared Media item for both languages.
- Payload Admin sections follow the frontend section sequence, with Hero first.
- No raw Sanity asset references are shown to editors.
- Live Preview must remain available while editing and show unsaved draft changes only to the editor, never on the public site.

## Completed in code

- Payload 3.91, Next integration, PostgreSQL adapter, Cloudinary media delivery, Payload Admin, Users, Media, CMS documents, and submissions collections are present.
- CMS documents preserve the original source snapshot and expose structured editor fields for text, SEO, links, shared media, and galleries.
- English and Arabic editor fields are paired and ordered correctly; raw `_sanity` implementation fields are hidden.
- Page content is grouped by frontend section and ordered with Hero first.
- Within every Payload editor section, fields are presentation-ordered without changing stored data: main title/heading, paragraph/description, subheading/eyebrow, CTA/link, then shared image/video/gallery media. Repeated content items retain their own grouping.
- `npm run order:cms-fields` safely applies that editor-only sequence to existing CMS documents. It has been run after correcting Payload empty-gallery rows, and the live Home Hero API order is verified as title, paragraph, supporting text, CTA, then video.
- Active CMS API routes and frontend consumers have been switched to Payload-aware reads.
- All five active lead routes contain Payload persistence to the Admin **Form submissions** collection: Contact, Press Kit, Vendor, Corporate Partner, and Community Partner. The form-specific email and Google Sheets deliveries remain additional integrations, not CMS dependencies.
- Form submissions are now editor-friendly: the list shows submission type, name, email, phone, organisation/brand/club, and date. Opening a lead shows labelled read-only fields for selected races/villages and message/notes; the technical source ID and JSON payload are hidden but preserved.
- No active frontend code sends content or submissions to Sanity. Remaining Sanity references are importer/archive scripts and the protected one-time migration endpoint only.
- Draft/live-preview support is implemented with signed preview access so unpublished changes are not exposed on the public website.
- The custom Admin preview control retains its last valid signed iframe URL while Payload recalculates draft data, so the right-side preview stays mounted through every edit and supports desktop/mobile breakpoints.
- The Sanity importer is idempotent and imports source media before mapping document media relationships.
- Video migration now correctly resolves all exported formats: `.webm`, `.mp4`, and Sanity-exported `-mp4.bin` files.
- Local Payload media URLs now use Payload's supported `/api/media/file/<filename>` endpoint rather than the invalid `/media/<filename>` fallback.
- The Media Admin list shows filename, MIME type, and update time; imported records retain the original filename.
- Terms and Conditions is a Payload Site Content document. Its title and full Terms body are editable in English/Arabic fields, while the public page retains its existing layout.
- Legacy `_payloadMediaSourceId` values in imported content are resolved server-side to Cloudinary URLs before any frontend page receives them; raw migration markers never reach Route Maps or other page UI.
- Route Maps discard invalid/empty gallery values and use stable keys; the Qidfa two-lap 10KM maps now resolve to Cloudinary URLs.
- The homepage calendar now renders only the active scroll-driven calendar, not the duplicate archived calendar implementation; Rahhal movement remains attached to the visible scroll sequence.
- Standard looping videos are started only by visibility observation, not repeatedly by `canplay` events.

- TypeScript validation passes with `npx tsc --noEmit`.

## Media and video storage model

- Payload Media records (filename, MIME type, alt text, source ID, relationship IDs) are stored in PostgreSQL.
- Actual uploaded bytes are stored in Cloudinary when `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are configured.
- Cloudinary-delivered images use automatic browser format and quality (`f_auto,q_auto`) without modifying the original upload. Next image responses are cached for 30 days to reduce repeat origin/CDN requests; videos stream directly and retain byte-range playback.
- During local development without Cloudinary, Payload stores file bytes in the ignored local `media/` directory and serves them at `/api/media/file/<filename>`.
- The repository includes the original migration backup at `.migration/sanity-export/` (ignored by Git) and local development media at `media/` (ignored by Git). These are not production storage.


## Migration status

- **Media migration is complete.** All 298 existing Payload Media records have Cloudinary public IDs. The final Cloudinary backfill report recorded 22 uploads and zero failures; new dashboard uploads also go to Cloudinary.

## Video behaviour and diagnosis

- Standard Hero/About videos use `loop`; they should replay continuously while at least 10% visible. They pause when scrolled out of view to save bandwidth.
- The default Rahhal animation does not have `loop`; it intentionally ends after its source clip finishes. Trait preview videos do loop while a card is active.
- A looping video that stops after only a few seconds is not caused by the standard player component. Verify that its selected Payload Media record has a complete Cloudinary asset, a `res.cloudinary.com` URL, and normal streamed playback after Cloudinary is configured.
- The Media Admin picker receives Cloudinary delivery URLs after the completed migration, including newly uploaded dashboard media.

## Required completion checklist

1. Keep the production `DATABASE_URL` and Cloudinary credentials configured.
2. Confirm one new image and one new video upload in Payload Admin reaches Cloudinary and plays from the deployed site.
3. Test home, about, contact, FAQ, Terms and Conditions, navbar, footer, partner, vendor, and all race pages in English and Arabic.
4. Test draft edits in Live Preview, then verify the public page changes only after Publish.
5. Run TypeScript, production build, CMS Admin authentication, forms, SEO, and responsive regression checks.
6. Once production verification is complete, remove the remaining archived Sanity schemas, scripts, environment variables, and migration endpoint.

## Definition of done

The migration is complete only when Payload is the active CMS for every supported page and form; all bilingual content and shared media are editable; every imported/new media asset is delivered from Cloudinary in production; draft preview is real-time and private; published content alone appears publicly; and the existing EVRS design remains visually unchanged.