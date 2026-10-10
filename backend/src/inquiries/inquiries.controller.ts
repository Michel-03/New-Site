import { Body, Controller, Post } from "@nestjs/common";
import { CreateInquiryDto } from "./create-inquiry.dto";
import { InquiriesService } from "./inquiries.service";

// The contact form posts to /api/inquiries. The dev server may forward that
// path unchanged, or strip /api before it reaches this API.
@Controller(["inquiries", "api/inquiries"])
export class InquiriesController {
  constructor(private readonly inquiries: InquiriesService) {}

  @Post()
  async create(@Body() body: CreateInquiryDto) {
    const inquiry = await this.inquiries.create(body);
    return {
      id: inquiry.id,
      received: true,
    };
  }
}
