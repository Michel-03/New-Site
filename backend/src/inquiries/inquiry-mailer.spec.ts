import { ServiceUnavailableException } from "@nestjs/common";
import { formatInquiryMail, inquiryRecipient, inquiryRecipientAddress, InquiryMailer } from "./inquiry-mailer";
import { InquiriesService, type Inquiry } from "./inquiries.service";

function restoreEnv(name: string, value: string | undefined) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

const sample: Inquiry = {
  id: "inquiry-1",
  createdAt: "2026-10-10T00:00:00.000Z",
  name: "Jordan Lee",
  email: "jordan@example.com",
  company: "Northwind",
  packageInterest: "Accelerate",
  message: "We want help scoping a forecasting use case.",
};

describe("inquiry mail", () => {
  const previous = {
    to: process.env.INQUIRY_TO,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  };

  afterEach(() => {
    restoreEnv("INQUIRY_TO", previous.to);
    restoreEnv("SMTP_USER", previous.user);
    restoreEnv("SMTP_PASS", previous.pass);
  });

  it("addresses the enquiry to the Byte Analytics inbox", () => {
    delete process.env.INQUIRY_TO;
    expect(inquiryRecipient()).toBe(inquiryRecipientAddress);
    expect(inquiryRecipientAddress).toBe("nagendragampala03@gmail.com");
  });

  it("includes the visitor details and lets the team reply to them", () => {
    const mail = formatInquiryMail(sample);
    expect(mail.subject).toBe("Byte Analytics enquiry from Jordan Lee");
    expect(mail.text).toContain("jordan@example.com");
    expect(mail.text).toContain("Northwind");
    expect(mail.text).toContain("Accelerate");
    expect(mail.text).toContain(sample.message);
  });

  it("refuses to send when the mailbox password is missing", async () => {
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    await expect(new InquiryMailer().send(sample)).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});

describe("InquiriesService", () => {
  const input = {
    name: sample.name,
    email: sample.email,
    company: sample.company,
    packageInterest: sample.packageInterest,
    message: sample.message,
  };

  it("emails the enquiry before confirming it", async () => {
    const sent: Inquiry[] = [];
    const mailer = {
      send: async (inquiry: Inquiry) => {
        sent.push(inquiry);
      },
    };
    const created = await new InquiriesService(mailer as unknown as InquiryMailer).create(input);

    expect(sent).toHaveLength(1);
    expect(sent[0].id).toBe(created.id);
    expect(sent[0].email).toBe("jordan@example.com");
  });

  it("does not confirm an enquiry when the email fails", async () => {
    const mailer = {
      send: async () => {
        throw new Error("smtp down");
      },
    };
    await expect(new InquiriesService(mailer as unknown as InquiryMailer).create(input)).rejects.toThrow(
      "smtp down",
    );
  });
});
