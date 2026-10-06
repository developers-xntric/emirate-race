import type { StructureResolver } from "sanity/structure";

const singleton = (S: Parameters<StructureResolver>[0], title: string, id: string) =>
  S.listItem().title(title).child(S.document().schemaType(id === "home" ? "homePage" : id === "contact" ? "contactPage" : "page").documentId(id));

export const structure: StructureResolver = (S) =>
  S.list().title("Emirates Villages Run Series").items([
    S.listItem().title("1. Navbar").child(S.document().schemaType("navbar").documentId("navbar")),
    S.listItem().title("2. Footer").child(S.document().schemaType("footer").documentId("footer")),
    singleton(S, "3. Home", "home"),
    S.listItem().title("4. About page").child(S.document().schemaType("aboutPage").documentId("about")),
    singleton(S, "5. Contact page", "contact"),
    S.listItem().title("6. FAQ page").child(S.document().schemaType("faqPage").documentId("faqs")),
    S.listItem().title("7. Race pages").child(S.documentTypeList("racePage").title("Race pages").defaultOrdering([{ field: "pageName", direction: "asc" }])),
    S.listItem().title("8. Lead Submissions").child(
      S.list().title("Lead Submissions").items([
        S.documentTypeListItem("contactLead").title("Contact enquiries"),
        S.documentTypeListItem("pressKitLead").title("Press Kit Downloads"),
        S.documentTypeListItem("vendorLead").title("Vendor bookings"),
        S.documentTypeListItem("corporatePartnerLead").title("Corporate partner enquiries"),
        S.documentTypeListItem("communityPartnerLead").title("Community partner enquiries"),
      ]),
    ),  ]);
