import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { CreateInquiryDto } from "./create-inquiry.dto";
import { InquiryMailer } from "./inquiry-mailer";

export type Inquiry = CreateInquiryDto & {
  id: string;
  createdAt: string;
};

@Injectable()
export class InquiriesService {
  private readonly items: Inquiry[] = [];

  constructor(private readonly mailer: InquiryMailer) {}

  async create(input: CreateInquiryDto): Promise<Inquiry> {
    const inquiry: Inquiry = {
      ...input,
      company: input.company?.trim() ?? "",
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await this.mailer.send(inquiry);
    this.items.push(inquiry);
    return inquiry;
  }
}
