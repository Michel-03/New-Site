import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { InquiriesModule } from "./inquiries/inquiries.module";

@Module({
  imports: [InquiriesModule],
  controllers: [HealthController],
})
export class AppModule {}
