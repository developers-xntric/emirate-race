const pages = [
  ["Navbar", "navbar"],
  ["Footer", "footer"],
  ["Home", "home"],
  ["About", "about"],
  ["Contact", "contact"],
  ["FAQs", "faqs"],
  ["Qidfa race", "race-qidfa"],
  ["Lahbab race", "race-al-lehbab"],
  ["Wadi Al Helo race", "race-wadi-al-helo"],
  ["Falaj Al Mualla race", "race-falaj-al-mualla"],
  ["Masfout race", "race-masfout"],
  ["Al Rams race", "race-al-rams"],
  ["Al Shuwaib race", "race-al-shuwaib"],
  ["Corporate partners", "evrs-corporate"],
  ["Community partners", "evrs-community"],
  ["Vendor form", "vendor-form-2026"],
  ["Terms and Conditions", "terms-and-conditions"],
] as const;

export default function PageNavigation() {
  return (
    <nav aria-label="Site pages" style={{ margin: "0 0 12px", padding: "0 8px" }}>
      <p style={{ fontSize: 12, fontWeight: 700, margin: "0 0 6px", opacity: 0.7, textTransform: "uppercase" }}>
        Site pages
      </p>
      {pages.map(([label, sourceId]) => (
        <a
          href={`/admin/collections/cms-documents?where[sourceId][equals]=${encodeURIComponent(sourceId)}`}
          key={sourceId}
          style={{ display: "block", padding: "5px 8px", textDecoration: "none" }}
        >
          {label}
        </a>
      ))}

    </nav>
  );
}