import { SITE } from "./site.js";

const SITE_URL = SITE.url;
const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export const PERSON_DESCRIPTION = SITE.person.description;

export const SITE_DESCRIPTION = `Personal site of ${SITE.name}: research, publications, and CV.`;

/** @param {{ imageUrl: string }} input */
export function personStructuredData({ imageUrl }) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE.name,
    givenName: SITE.givenName,
    familyName: SITE.familyName,
    description: PERSON_DESCRIPTION,
    url: `${SITE_URL}/`,
    image: imageUrl,
    sameAs: SITE.person.sameAs,
    jobTitle: SITE.person.jobTitle,
    email: SITE.email,
    affiliation: SITE.person.affiliation,
    knowsAbout: SITE.person.knowsAbout,
  };
}

/** The site itself, owned by the Person. Emitted on every page. */
export function websiteStructuredData() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: SITE.name,
    description: SITE_DESCRIPTION,
    inLanguage: "en-US",
    publisher: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
  };
}

/**
 * The page-level node: a WebPage (or subtype) that belongs to the site, plus a
 * BreadcrumbList for every page below the homepage.
 *
 * @param {{
 *   url: string,
 *   name: string,
 *   description: string,
 *   imageUrl: string,
 *   pageType?: string,
 *   breadcrumbs?: Array<{ name: string, url: string }>,
 *   about?: boolean,
 *   mainEntity?: object,
 * }} input
 */
export function pageStructuredData({
  url,
  name,
  description,
  imageUrl,
  pageType = "WebPage",
  breadcrumbs = [],
  about = false,
  mainEntity,
}) {
  /** @type {object[]} */
  const nodes = [];
  /** @type {Record<string, unknown>} */
  const page = {
    "@type": pageType,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: "en-US",
    isPartOf: { "@id": WEBSITE_ID },
    primaryImageOfPage: { "@type": "ImageObject", url: imageUrl },
  };
  if (about) page.about = { "@id": PERSON_ID };
  // A ProfilePage is about the person it profiles.
  if (mainEntity) page.mainEntity = mainEntity;
  else if (pageType === "ProfilePage") page.mainEntity = { "@id": PERSON_ID };

  if (breadcrumbs.length > 0) {
    page.breadcrumb = { "@id": `${url}#breadcrumb` };
    nodes.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    });
  }

  return [page, ...nodes];
}

/**
 * Papers as ScholarlyArticle nodes. The site owner is linked by @id; co-authors are
 * plain names because the site does not know their profiles.
 *
 * @param {Array<{
 *   id: string,
 *   title: string,
 *   authors: string[],
 *   year: number,
 *   venue: string | null,
 *   arxiv: string | null,
 *   tldr: string | null,
 *   tags: string[],
 *   preprint?: boolean,
 * }>} papers
 */
export function paperListStructuredData(papers) {
  return papers.map((paper) => ({
    "@type": "ScholarlyArticle",
    "@id": `${SITE_URL}/research/#${paper.id}`,
    url: `${SITE_URL}/research/#${paper.id}`,
    headline: paper.title,
    name: paper.title,
    // Work under review has no publication date or publisher yet.
    ...(paper.preprint ? {} : { datePublished: String(paper.year) }),
    author: paper.authors.map((name) =>
      name === SITE.name
        ? { "@id": PERSON_ID }
        : { "@type": "Person", name },
    ),
    ...(paper.tldr ? { abstract: paper.tldr } : {}),
    ...(paper.venue && !paper.preprint
      ? { publisher: { "@type": "Organization", name: paper.venue } }
      : {}),
    ...(paper.arxiv ? { sameAs: paper.arxiv } : {}),
    keywords: paper.tags.join(", "),
    inLanguage: "en",
  }));
}

/**
 * Wrap nodes in one @graph under a single @context.
 *
 * @param {object[]} nodes
 */
export function graph(nodes) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

/** @param {Record<string, unknown>} node */
export function withoutContext(node) {
  const { "@context": _context, ...rest } = node;
  return rest;
}
