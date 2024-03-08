import { IsTimeZone } from "@/modules/users/inputs/validators/is-time-zone";
import { Transform } from "class-transformer";
import { IsBoolean, IsNumber, IsString, IsOptional, IsArray, Validate } from "class-validator";

export class CreateBookingInput {
  @IsString()
  @IsOptional()
  end?: string;

  @IsString()
  start!: string;

  @IsNumber()
  eventTypeId!: number;

  @IsString()
  @IsOptional()
  eventTypeSlug?: string;

  @IsString()
  @IsOptional()
  rescheduleUid?: string;

  @IsString()
  @IsOptional()
  recurringEventId?: string;

  @IsString()
  @Validate(IsTimeZone)
  timeZone!: string;

  @Transform(({ value }: { value: string | string[] }) => {
    return typeof value === "string" ? [value] : value;
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  user?: string[];

  @IsString()
  language!: string;

  @IsString()
  @IsOptional()
  bookingUid?: string;

  metadata!: Record<string, string>;

  @IsBoolean()
  @IsOptional()
  hasHashedBookingLink?: boolean;

  @IsString()
  @IsOptional()
  hashedLink!: string | null;

  @IsString()
  @IsOptional()
  seatReferenceUid?: string;
}
