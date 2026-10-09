import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export const packageOptions = ["Discover", "Accelerate", "Pioneer"] as const;

export class CreateInquiryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  company?: string;

  @IsIn(packageOptions)
  packageInterest!: (typeof packageOptions)[number];

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  message!: string;
}
