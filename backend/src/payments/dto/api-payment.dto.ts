import { IsString, IsNotEmpty, IsOptional, IsNumber, IsIn } from 'class-validator';

export class ApiPaymentDto {
  @IsString()
  @IsNotEmpty()
  order_no!: string;

  @IsString()
  @IsNotEmpty()
  amount!: string;

  @IsString()
  @IsOptional()
  customer_name?: string;

  @IsString()
  @IsNotEmpty()
  email_id!: string;

  @IsString()
  @IsNotEmpty()
  mobile_no!: string;

  @IsString()
  @IsOptional()
  bill_address?: string;

  @IsString()
  @IsOptional()
  bill_city?: string;

  @IsString()
  @IsOptional()
  bill_state?: string;

  @IsString()
  @IsOptional()
  bill_country?: string;

  @IsString()
  @IsOptional()
  bill_zip?: string;

  @IsString()
  @IsOptional()
  ship_address?: string;

  @IsString()
  @IsOptional()
  ship_city?: string;

  @IsString()
  @IsOptional()
  ship_state?: string;

  @IsString()
  @IsOptional()
  ship_country?: string;

  @IsString()
  @IsOptional()
  ship_zip?: string;

  @IsString()
  @IsOptional()
  ship_days?: string;

  @IsString()
  @IsOptional()
  address_count?: string;

  @IsString()
  @IsOptional()
  item_count?: string;

  @IsString()
  @IsOptional()
  item_value?: string;

  @IsString()
  @IsOptional()
  item_category?: string;

  @IsString()
  @IsOptional()
  udf_1?: string;

  @IsString()
  @IsOptional()
  udf_2?: string;

  @IsString()
  @IsOptional()
  udf_3?: string;

  @IsString()
  @IsOptional()
  udf_4?: string;

  @IsString()
  @IsOptional()
  udf_5?: string;

  @IsString()
  @IsOptional()
  udf_6?: string;

  @IsString()
  @IsOptional()
  udf_7?: string;

  // Payment Gateway specific fields
  @IsString()
  @IsOptional()
  pg_id?: string;

  @IsString()
  @IsOptional()
  paymode?: string;

  @IsString()
  @IsOptional()
  scheme_id?: string;

  @IsString()
  @IsOptional()
  wallet_type?: string;
}

export class ApiPaymentResponseDto {
  @IsString()
  @IsNotEmpty()
  merchantId!: string;

  @IsString()
  @IsNotEmpty()
  merchantRequest!: string;
}
