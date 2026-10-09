import "reflect-metadata";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateInquiryDto } from "./create-inquiry.dto";

describe("CreateInquiryDto", () => {
  it("accepts a complete consultation request", async () => {
    const dto = plainToInstance(CreateInquiryDto, {
      name: "Jordan Lee",
      email: "jordan@example.com",
      company: "Northwind",
      packageInterest: "Accelerate",
      message: "We want help scoping a forecasting use case.",
    });

    expect(await validate(dto)).toHaveLength(0);
  });

  it("rejects a short name, a bad email, and an unknown package", async () => {
    const dto = plainToInstance(CreateInquiryDto, {
      name: "A",
      email: "not-an-email",
      packageInterest: "Unlimited",
      message: "too short",
    });
    const errors = await validate(dto);

    expect(errors.map((error) => error.property).sort()).toEqual([
      "email",
      "message",
      "name",
      "packageInterest",
    ]);
  });
});
