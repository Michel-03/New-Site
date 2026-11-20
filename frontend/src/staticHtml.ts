import {
  about,
  accelerators,
  caseStudies,
  company,
  contact,
  packages,
  privateAi,
  services,
  stats,
  steps,
  testimonial,
} from "./content";

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const list = (items: string[]) => `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;

/** Plain HTML version of the page so search engines and no-JS visitors see the content. */
export function renderStaticHtml(): string {
  const sections = [
    `<header><h1>${escapeHtml(`${company.headlineLead} ${company.headlineAccent}`)}</h1><p>${escapeHtml(company.summary)}</p>${list(
      stats.map((stat) => `${stat.prefix}${stat.value}${stat.suffix} — ${stat.label}`),
    )}</header>`,
    `<section id="services-static"><h2>Services</h2>${services
      .map((service) => `<h3>${escapeHtml(service.title)}</h3><p>${escapeHtml(service.body)}</p>`)
      .join("")}</section>`,
    `<section id="case-studies-static"><h2>Case studies</h2>${caseStudies
      .map(
        (study) =>
          `<article><h3>${escapeHtml(study.title)}</h3><p>${escapeHtml(study.client)} — ${escapeHtml(study.result)}</p><p>${escapeHtml(
            study.problem,
          )}</p><p>${escapeHtml(study.built)}</p></article>`,
      )
      .join("")}</section>`,
    `<section><h2>${escapeHtml(privateAi.title)}</h2><p>${escapeHtml(privateAi.body)}</p></section>`,
    `<section><h2>How we work</h2><ol>${steps
      .map((step) => `<li>${escapeHtml(`${step.title} (${step.duration}): ${step.body}`)}</li>`)
      .join("")}</ol></section>`,
    `<section><h2>AI Accelerators (${escapeHtml(accelerators.status)})</h2>${list(
      accelerators.items.map((item) => `${item.title}: ${item.body}`),
    )}</section>`,
    `<section><blockquote>${escapeHtml(testimonial.quote)}</blockquote><p>${escapeHtml(
      [testimonial.name, testimonial.role].filter(Boolean).join(", "),
    )}</p></section>`,
    `<section><h2>${escapeHtml(about.title)}</h2><p>${escapeHtml(about.body)}</p></section>`,
    `<section><h2>Packages</h2>${packages
      .map((item) => `<h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.summary)}</p>${list(item.deliverables)}`)
      .join("")}</section>`,
    `<section><h2>Contact</h2><p><a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a></p><address>${escapeHtml(
      [contact.legalName, ...contact.address.lines].join(", "),
    )}</address></section>`,
  ];
  return `<div class="ba-static">${sections.join("")}</div>`;
}

export function renderOrganizationJsonLd(): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: company.name,
    description: company.summary,
    legalName: contact.legalName,
    email: contact.email,
    foundingDate: "2019",
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address.streetAddress,
      addressLocality: contact.address.locality,
      addressRegion: contact.address.region,
      postalCode: contact.address.postalCode,
      addressCountry: contact.address.country,
    },
    knowsAbout: services.map((service) => service.title),
    ...(contact.phone ? { telephone: contact.phone } : {}),
    ...(contact.linkedin ? { sameAs: [contact.linkedin] } : {}),
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
