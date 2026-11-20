import { Controller, Get } from "@nestjs/common";

@Controller(["health", "api/health"])
export class HealthController {
  @Get()
  check() {
    return { status: "ok" };
  }
}
