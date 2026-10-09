import { Module } from "@nestjs/common";
import { InquiriesController } from "./inquiries.controller";
import { InquiriesService } from "./inquiries.service";
import { InquiryMailer } from "./inquiry-mailer";

@Module({
  controllers: [InquiriesController],
  providers: [InquiriesService, InquiryMailer],
})
export class InquiriesModule {}
