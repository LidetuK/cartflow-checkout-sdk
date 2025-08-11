import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { aes256CbcEncryptToBase64, aes256CbcDecryptFromBase64, sha256Base64 } from './utils/crypto.util';

interface InitiateResponse {
  me_id: string;
  merchant_request: string;
  hash: string;
  post_url: string;
}

@Injectable()
export class PaymentsService {
  private readonly iv = '0123456789abcdef';

  constructor(private readonly configService: ConfigService) {}

  buildSections(dto: InitiatePaymentDto): string {
    const aggregatorId = this.configService.get<string>('yagout.aggregatorId') || 'yagout';

    // Build each section per YagoutPay: pipe-separated, empty placeholders kept
    const txn_details = [
      dto.order_no,
      dto.amount,
      'INR', // currency assumed; adjust if needed
      '', // transaction_type (if any)
      aggregatorId,
      '', // bank_code or payment_option if needed
    ].join('|');

    const cust_details = [
      dto.customer_name || '',
      dto.email_id,
      dto.mobile_no,
      '', // address
      '', // city
      '', // state
      '', // country
      '', // zip
    ].join('|');

    const item_details = [
      '', // item_code
      '', // item_qty
      '', // item_amount
    ].join('|');

    const other_details = [
      dto.success_url,
      dto.failure_url,
      '', // channel
      '', // udf1
      '', // udf2
      '', // udf3
      '', // udf4
      '', // udf5
    ].join('|');

    return [txn_details, cust_details, item_details, other_details].join('~');
  }

  initiate(dto: InitiatePaymentDto): InitiateResponse {
    const merchantId = this.configService.get<string>('yagout.merchantId', '');
    const keyBase64 = this.configService.get<string>('yagout.encryptionKeyBase64', '');
    const postUrl = this.configService.get<string>('yagout.uatPostUrl', '');

    const combined = this.buildSections(dto);
    const encrypted = aes256CbcEncryptToBase64(combined, keyBase64, this.iv);
    const hash = sha256Base64(encrypted);

    return {
      me_id: merchantId,
      merchant_request: encrypted,
      hash,
      post_url: postUrl,
    };
  }

  decryptCallbackPayload(encryptedBase64: string): string {
    const keyBase64 = this.configService.get<string>('yagout.encryptionKeyBase64', '');
    return aes256CbcDecryptFromBase64(encryptedBase64, keyBase64, this.iv);
  }
}


