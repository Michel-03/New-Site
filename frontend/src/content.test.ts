import { describe, expect, it } from "vitest";
import {
  accelerators,
  bookingHref,
  caseStudies,
  company,
  contact,
  journey,
  nav,
  packages,
  privacy,
  services,
  testimonial,
} from "./content";
import { emptyInquiry, inquiryErrors } from "./inquiry";
import { renderNotFoundHtml, renderOrganizationJsonLd, renderPrivacyHtml, renderStaticHtml } from "./staticHtml";

describe("site content", () => {
  it("uses Byte Analytics as the company name", () => {
    expect(company.name).toBe("Byte Analytics");
  });

  it("shows the three-step journey from data to production in the hero", () => {
    expect(journey.map((step) => step.title)).toEqual(["Data platforms", "ML systems", "AI in production"]);
    expect(journey.filter((step) => step.dark)).toHaveLength(1);
  });

  it("uses the Hyderabad office in the hero eyebrow, not London", () => {
    expect(company.eyebrow).toContain("Hyderabad");
    expect(company.eyebrow).not.toContain("London");
  });

  it("orders services along the data → ML → AI journey", () => {
    expect(services.map((service) => service.title)).toEqual([
      "Data Engineering",
      "Lakehouse (Databricks / Snowflake)",
      "ML Engineering & MLOps",
      "AI & GenAI",
      "Cloud & DevOps",
      "Automation & Integration",
    ]);
  });

  it("points every navigation item at a real section", () => {
    expect(nav.map((item) => item.id)).toEqual([
      "services",
      "case-studies",
      "private-ai",
      "accelerators",
      "about",
      "packages",
      "contact",
    ]);
  });

  it("marks Accelerate as the featured package", () => {
    expect(packages.find((item) => item.featured)?.name).toBe("Accelerate");
  });

  it("gives every package different deliverables", () => {
    const deliverables = packages.map((item) => item.deliverables.join("|"));
    expect(new Set(deliverables).size).toBe(packages.length);
  });

  it("avoids claims that need evidence before launch", () => {
    const allText = JSON.stringify({ packages, company });
    expect(allText).not.toMatch(/PhD/i);
    expect(allText).not.toMatch(/partner/i);
    expect(accelerators.status).toBe("In development");
  });

  it("only names the testimonial author when a name is set", () => {
    expect(testimonial.role).not.toBe("");
    if (!testimonial.name) {
      expect(testimonial.role).toBe("Director, US energy company");
    }
  });

  it("shows case studies with a problem, build, result and technology", () => {
    expect(caseStudies.length).toBeGreaterThanOrEqual(3);
    for (const study of caseStudies) {
      expect(study.problem && study.built && study.result).toBeTruthy();
      expect(study.tech.length).toBeGreaterThan(0);
    }
  });

  it("describes the pipeline case study with the measured results and the work actually done", () => {
    const [pipeline] = caseStudies;
    expect(pipeline.result).toBe("91 → ~19 min");
    expect(pipeline.note).toBe("77 → 16.5 min in the test environment");
    expect(pipeline.built).toContain("small Spark calls");
    expect(pipeline.built).toContain("in parallel");
    expect(JSON.stringify(pipeline)).not.toMatch(/Delta Lake|incremental|partitioning|80 min|25 min/i);
  });

  it("follows the Accelerators switch in the menu", () => {
    const hasLink = nav.some((item) => item.id === "accelerators");
    expect(hasLink).toBe(accelerators.show);
  });

  it("has a privacy notice that covers what is collected, why, and how to use your rights", () => {
    const text = JSON.stringify(privacy);
    expect(privacy.sections.map((section) => section.title)).toEqual(
      expect.arrayContaining(["What we collect", "Why we use your information", "Your rights"]),
    );
    expect(text).toContain("Digital Personal Data Protection Act");
    expect(text).toContain("GDPR");
    expect(text).toContain(contact.email);
  });

  it("falls back to an email request when no booking link is set", () => {
    expect(contact.email).toContain("@");
    expect(bookingHref()).toBe(contact.bookingUrl || `mailto:${contact.email}?subject=Request%20a%2030-minute%20call`);
  });
});

describe("pre-rendered HTML", () => {
  it("contains the headline, services, case studies and contact email", () => {
    const html = renderStaticHtml();
    expect(html).toContain("<h1>");
    expect(html).toContain("ML Engineering &amp; MLOps");
    expect(html).toContain(caseStudies[0].title);
    expect(html).toContain(contact.email);
  });

  it("renders the privacy notice as plain HTML for /privacy", () => {
    const html = renderPrivacyHtml();
    expect(html).toContain("<h1>Privacy notice</h1>");
    expect(html).toContain("What we collect");
    expect(html).toContain(contact.email);
  });

  it("produces valid structured data", () => {
    const data = JSON.parse(renderOrganizationJsonLd());
    expect(data.name).toBe("Byte Analytics");
    expect(data.legalName).toBe("Byte Analytics Private Ltd.");
    expect(data.address.postalCode).toBe("500084");
    expect(data.address.addressCountry).toBe("IN");
  });

  it("adds the site address to structured data only when it is known", () => {
    expect(JSON.parse(renderOrganizationJsonLd()).url).toBeUndefined();
    expect(JSON.parse(renderOrganizationJsonLd("https://www.example.com")).url).toBe("https://www.example.com");
  });

  it("renders a 404 message with a way back home", () => {
    const html = renderNotFoundHtml();
    expect(html).toContain("could not find that page");
    expect(html).toContain('href="/"');
    expect(html).toContain(contact.email);
  });

  it("uses the confirmed company email and Hyderabad address", () => {
    expect(contact.email).toBe("info@byteanalytics.co.in");
    expect(contact.address.lines.join(" ")).toContain("Kondapur");
    expect(contact.address.lines.join(" ")).toContain("500084");
  });
});

describe("inquiry validation", () => {
  it("asks for a name, email, and a real message", () => {
    expect(
      inquiryErrors({
        name: "A",
        email: "not-an-email",
        company: "",
        packageInterest: "Discover",
        message: "short",
        website: "",
      }),
    ).toEqual([
      "Enter your name.",
      "Enter a valid work email.",
      "Tell us a little more — at least a sentence.",
    ]);
  });

  it("accepts a complete consultation request", () => {
    expect(
      inquiryErrors({
        name: "Jordan Lee",
        email: "jordan@example.com",
        company: "Northwind",
        packageInterest: "Pioneer",
        message: "We want help scoping a forecasting use case.",
        website: "",
      }),
    ).toEqual([]);
  });

  it("starts with an empty hidden trap field", () => {
    expect(emptyInquiry().website).toBe("");
  });
});
