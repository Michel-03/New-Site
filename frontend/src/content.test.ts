import { describe, expect, it } from "vitest";
import { company, nav, packages, services } from "./content";
import { inquiryErrors } from "./inquiry";

describe("site content", () => {
  it("uses Byte Analytics as the company name", () => {
    expect(company.name).toBe("Byte Analytics");
  });

  it("keeps the six practice areas from the existing site", () => {
    expect(services.map((service) => service.title)).toEqual([
      "Artificial Intelligence",
      "Data Science",
      "Data Engineering",
      "Lakeflow & Data Warehousing",
      "Cloud Services",
      "Automation & Integration",
    ]);
  });

  it("points every navigation item at a real section", () => {
    expect(nav.map((item) => item.id)).toEqual([
      "services",
      "platform",
      "process",
      "cortex",
      "packages",
      "contact",
    ]);
  });

  it("marks Accelerate as the featured package", () => {
    expect(packages.find((item) => item.featured)?.name).toBe("Accelerate");
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
      }),
    ).toEqual([]);
  });
});
