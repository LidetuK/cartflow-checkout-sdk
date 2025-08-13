import { IsString, IsOptional, IsNumberString, IsEmail, Matches, Length } from 'class-validator';

export class InitiatePaymentDto {
  @IsString()
  order_no!: string;

  // Amount string with 2 decimals; allow either number string or decimal with 2 places
  @Matches(/^\d+(\.\d{2})$/, {
    message: 'amount must be a string with two decimal places (e.g., 100.00)',
  })
  amount!: string;

  @IsString()
  success_url!: string;

  @IsString()
  failure_url!: string;

  @IsOptional()
  @IsString()
  customer_name?: string;

  @IsEmail()
  email_id!: string;

  @IsString()
  @Length(7, 20)
  @IsNumberString()
  mobile_no!: string;

  // Optional billing fields that frontend might send
  @IsOptional()
  @IsString()
  bill_address?: string;

  @IsOptional()
  @IsString()
  bill_city?: string;

  @IsOptional()
  @IsString()
  bill_state?: string;

  @IsOptional()
  @IsString()
  bill_country?: string;

  @IsOptional()
  @IsString()
  bill_zip?: string;
}


