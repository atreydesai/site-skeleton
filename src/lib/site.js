// Site identity: the one place that says whose site this is.
//
// Every value below is a placeholder. Replace each one with your own before
// deploying. The README's "Make it yours" checklist lists the content files
// that need the same treatment (homepage.yaml, about.yaml, cv.yaml,
// talks.yaml, papers/*.md).

export const SITE = {
  /** Production origin, no trailing slash. Used for canonical URLs, the sitemap and structured data. */
  url: "https://example.com",

  /** Full name as it appears in titles, meta tags and author lists. Your name in a paper's author list is highlighted when it matches this exactly. */
  name: "Your Name",
  givenName: "Your",
  familyName: "Name",

  /** Lowercase name shown in the header wordmark and the homepage greeting. */
  wordmark: "your name",

  email: "you@example.edu",

  // Twitter/X handle for card metadata, including the at sign. "" omits it.
  twitter: "",

  /** Default meta description (the homepage's). */
  description:
    "I am a researcher studying your field at Your University, advised by Professor Advisor One.",

  /** Alt text for /og-image.jpg and /og-image-wide.jpg. */
  portraitAlt: "Portrait of Your Name",

  /** The CV PDF in static/ (vite.config.ts dates it from static/cv.pdf), and the filename it downloads as. */
  cvPdf: "/cv.pdf",
  cvDownloadName: "Your_Name_CV.pdf",

  /** The footer clock: an IANA time zone and the place shown under it. */
  timeZone: "America/New_York",
  location: "your city",

  /** Structured-data (schema.org Person) details. Keep in step with cv.yaml. */
  person: {
    description:
      "Your Name is a researcher at Your University studying your field.",
    jobTitle: "Researcher",
    sameAs: [
      "https://github.com/your-username",
      "https://scholar.google.com/citations?user=YOUR_ID",
      "https://orcid.org/0000-0000-0000-0000",
    ],
    affiliation: [
      {
        "@type": "CollegeOrUniversity",
        name: "Your University",
        url: "https://www.example.edu",
      },
    ],
    knowsAbout: ["Your Field", "Your Subfield"],
  },
};
