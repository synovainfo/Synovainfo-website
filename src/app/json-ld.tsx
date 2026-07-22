const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://synovainfotech.com/#organization",
      name: "Synova Infotech Private Limited",
      url: "https://synovainfotech.com",
      legalName: "Synova Infotech Private Limited",
      description:
        "Enterprise software development company based in Pune, India. Delivering custom software, cloud solutions, AI/ML, cybersecurity, and digital transformation services.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Fl-24, Trish Manor, Kondhwa",
        addressLocality: "Pune",
        addressRegion: "Maharashtra",
        postalCode: "411048",
        addressCountry: "IN",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        url: "https://synovainfotech.com",
      },
      identifier: "U62099PN2026PTC257266",
      foundingDate: "2026",
    },
    {
      "@type": "WebSite",
      "@id": "https://synovainfotech.com/#website",
      url: "https://synovainfotech.com",
      name: "Synova Infotech",
      description:
        "Enterprise software development company in Pune, India",
      publisher: {
        "@id": "https://synovainfotech.com/#organization",
      },
      inLanguage: "en-US",
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://synovainfotech.com/#localbusiness",
      parentOrganization: {
        "@id": "https://synovainfotech.com/#organization",
      },
      name: "Synova Infotech Private Limited",
      description:
        "Enterprise software development company in Pune delivering custom software, cloud solutions, AI/ML, cybersecurity, and digital transformation services.",
      url: "https://synovainfotech.com",
      telephone: "",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Fl-24, Trish Manor, Kondhwa",
        addressLocality: "Pune",
        addressRegion: "Maharashtra",
        postalCode: "411048",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 18.4598,
        longitude: 73.8926,
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
      priceRange: "₹₹",
      areaServed: [
        {
          "@type": "City",
          name: "Pune",
        },
        {
          "@type": "Country",
          name: "India",
        },
      ],
    },
    {
      "@type": "Service",
      "@id": "https://synovainfotech.com/#service",
      provider: {
        "@id": "https://synovainfotech.com/#organization",
      },
      name: "Enterprise Software Development Services",
      description:
        "End-to-end software development including custom applications, cloud migration, AI/ML solutions, cybersecurity, and digital transformation.",
      serviceType: [
        "Custom Software Development",
        "Cloud Solutions & Migration",
        "Artificial Intelligence & Machine Learning",
        "Cybersecurity Services",
        "Digital Transformation Consulting",
        "DevOps & CI/CD",
        "Mobile Application Development",
        "API Development & Integration",
      ],
      areaServed: "India",
    },
  ],
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
