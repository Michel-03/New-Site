import { Body, Controller, Post } from "@nestjs/common";
import { CreateInquiryDto } from "./create-inquiry.dto";
import { InquiriesService } from "./inquiries.service";

@Controller("inquiries")
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
