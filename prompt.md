Okay, now analyze the `D:\americana-computers` project for Sanity integration.

  I want to integrate all pages with the Sanity CMS. All environment variables are already in the `.env` file, so first check them and use the existing environment variables.

  The following must be editable from Sanity CMS:

  * All navbar content
  * Footer content
  * Contact form fields and field names
  * Modal fields and field names
  * Navbar races dropdown
  * All pages
  * All sections on all pages
  * Section headings/titles
  * Paragraphs
  * CTA/button text
  * Images
  * Image uploading

  Everything that is currently added to the website must remain exactly as it is by default.

  **Very important:**

  * Do not miss any existing content.
  * Do not replace existing content with different content.
  * Do not remove any existing content.
  * Do not change any existing English content.
  * Do not change any existing Arabic content.
  * Do not change the existing images.
  * Do not move content or images into another section.
  * Everything currently visible on the website must be represented in the Sanity fields.
  * Existing content and images must automatically appear as the default values in Sanity.
  * If a user changes the content or image from Sanity, the website should update accordingly.

  ### Sanity Studio structure

  In the Sanity dashboard, structure the documents clearly.

  The order should be:

  1. Navbar
  2. Footer
  3. Pages

  For pages, when the user opens a page, its sections should be shown separately and clearly.

  For example, the homepage should have its own document/structure, the Contact page should have its own, the About Us page should have its own, etc but all race spages inerr shoeub have smae
  schems strucutor.

  Each page should contain its sections separately so the user can easily find and edit exactly the section they want.

  ### Section fields

  For every section, add a section name field.

  The section name should be based on the current section's existing heading, label, or content name so the user can identify the section easily and navigate directly to the exact section they
  want to edit.

  For example, if a section currently has a heading/title, use that as the section name/label in Sanity.

  If a section contains:

  * Title
  * Paragraph
  * CTA/button
  * Image

  Then the fields should be arranged exactly like this:

  1. English title
  2. Arabic title
  3. English paragraph
  4. Arabic paragraph
  5. English CTA/button
  6. Arabic CTA/button
  7. Image

  The image field should be a single image field only.

  The same image should be used for both English and Arabic. There should not be separate English and Arabic image fields.

  For sections that only contain certain content, only create the fields that actually exist for that section.

  For example, if a section does not currently have an image, do not add an unnecessary image field.

  If a section does not have a CTA, do not add a CTA field.

  The Sanity schema should be created according to the actual existing sections and content of each page.

  ### Existing content must remain unchanged

  Make sure every existing English and Arabic title, paragraph, CTA, image, etc. is preserved exactly as it currently exists.

  Do not rewrite, translate, improve, replace, or modify any existing content.

  The current website content must appear in Sanity as the default content.

  The current images must also appear as the default images.

  If the user does not change anything in Sanity, the website should look and behave exactly the same as it currently does.

  If the user changes something from Sanity, only that changed content or image should update on the website.

  ### Race pages

  For all race pages, use the same Sanity schema because all race pages have the same overall sections and structure.

  The content and images will be different for each race, but the schema should remain the same.

  There is one special difference:

  The Qidfa race page has a route-map tab/section that contains **2 images**.

  The other race pages have  route-map tab/section **1 image** in that same section.

  This difference is already implemented in the current website and must remain exactly as it is.

  Do not disturb this existing implementation.

  For all other race-page sections, the structure/schema should remain the same because the sections are the same; only their content and images differ between races.

  Make sure each race page uses its existing/default content and images.

  Do not replace one race's content or images with another race's content or images.

  ### Images

  Every image currently used by each section must be represented correctly in Sanity.

  The existing image for a section should be shown by default in its Sanity image field.

  If the user uploads/selects a different image in Sanity, that image should replace the existing image on the website.

  Do not assign an image from another section.

  Do not add images to sections where an image does not currently exist.

  For the race pages, preserve the existing image differences between races, including the Qidfa route-map section having 2 images while the other race pages have 1.

  ### Important implementation requirement

  Before making changes, carefully analyze the entire dotn disturb this  `D:\americana-computers` project and identify:

  * All pages
  * All navbar content
  * Footer
  * Contact form
  * Modal fields
  * All race pages and their differences

  Do not guess the sections or fields anlsy the page or seciton if you dont understand.

  Do not change the current UI/layout/design.

  Do not change the current content.

  Do not change the current images.

  Do not remove anything.a

  The goal is to make the existing website content fully manageable from Sanity CMS while keeping the website exactly the same by default.

  Everything currently present must remain present and editable from the Sanity dashboard.
  , Note: i have laredy comeplted he races innerspgae, contact us pages oth arbaic and eng integated with cms snaity nwo the hoempage is hslf integrated , adn about use fully ramin so thes 2
  pages ar ermeian dont disutrb the pages that already comeplted oaky and se inh homepage wherever the video prsent there shoueb be video fiel nto image adn also same fro previeeo fo defualt okay , iin eahc secton check do nto disutrb toher thigns okay dotn aisub any pthe rpage scher or duicmtn or intergeration