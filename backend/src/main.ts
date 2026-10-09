import "reflect-metadata";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

function loadProjectEnv() {
  const files = [resolve(process.cwd(), ".env")];
  if (existsSync(resolve(process.cwd(), "../package.json"))) {
    files.push(resolve(process.cwd(), "../.env"));
  }
  for (const file of files) {
    if (existsSync(file)) process.loadEnvFile(file);
  }
}

loadProjectEnv();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
