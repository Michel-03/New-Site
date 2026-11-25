import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CreateInquiryDto } from "./create-inquiry.dto";
import { InquiriesService } from "./inquiries.service";
import { RateLimitGuard } from "./rate-limit.guard";

// The contact form posts to /api/inquiries. The dev server may forward that
// path unchanged, or strip /api before it reaches this API.
@Controller(["inquiries", "api/inquiries"])
@UseGuards(RateLimitGuard)
export class InquiriesController {
  constructor(private readonly inquiries: InquiriesService) {}

  @Post()
  async create(@Body() body: CreateInquiryDto) {
    // Bots fill in the hidden field. Reply as if it worked, but send nothing.
    if (body.website?.trim()) {
      return { id: "", received: true };
    }

    const { website: _trap, ...enquiry } = body;
    const inquiry = await this.inquiries.create(enquiry);
    return {
      id: inquiry.id,
      received: true,
    };
  }
}
