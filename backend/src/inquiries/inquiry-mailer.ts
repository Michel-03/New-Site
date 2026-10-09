import { Injectable, Logger, ServiceUnavailableException } from "@nestjs/common";
import nodemailer from "nodemailer";
import type { Inquiry } from "./inquiries.service";

export const inquiryRecipientAddress = "nagendragampala03@gmail.com";

export function inquiryRecipient(): string {
  const configured = process.env.INQUIRY_TO?.trim();
  return configured || inquiryRecipientAddress;
}

export function formatInquiryMail(inquiry: Inquiry): { subject: string; text: string } {
  const company = inquiry.company?.trim() || "Not provided";
  return {
    subject: `Byte Analytics enquiry from ${inquiry.name}`,
    text: [
      "New consultation request from the Byte Analytics website.",
      "",
      `Name: ${inquiry.name}`,
      `Email: ${inquiry.email}`,
      `Company: ${company}`,
      `Package: ${inquiry.packageInterest}`,
      "",
      "Message:",
      inquiry.message,
    ].join("\n"),
  };
}

@Injectable()
export class InquiryMailer {
  private readonly logger = new Logger(InquiryMailer.name);

  async send(inquiry: Inquiry): Promise<void> {
    const user = process.env.SMTP_USER?.trim();
    const pass = process.env.SMTP_PASS?.replace(/\s/g, "");
    if (!user || !pass) {
      throw new ServiceUnavailableException(
        "We could not send your message. Mail is not configured yet.",
      );
    }

    const port = Number(process.env.SMTP_PORT ?? 587);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST?.trim() || "smtp.gmail.com",
      port,
      secure: port === 465,
      auth: { user, pass },
    });
    const mail = formatInquiryMail(inquiry);

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM?.trim() || `Byte Analytics <${user}>`,
        to: inquiryRecipient(),
        replyTo: inquiry.email,
        subject: mail.subject,
        text: mail.text,
      });
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Unknown mail error";
      this.logger.error(`Inquiry email failed: ${detail}`);
      throw new ServiceUnavailableException("We could not send your message. Please try again.");
    }
  }
}
