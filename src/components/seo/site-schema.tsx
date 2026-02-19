export function SiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RentNowPK",
    url: "https://www.rentnowpk.com",
    potentialAction: {
      "@type": "SearchAction",
      target:
        "https://www.rentnowpk.com/view-all-vehicles?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
