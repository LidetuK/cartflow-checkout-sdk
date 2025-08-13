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
    const merchantId = this.configService.get<string>('yagout.merchantId', '');

    // 1. Transaction Details (txn_details) - Required format from docs
    const txn_details = [
      aggregatorId,           // ag_id
      merchantId,             // me_id
      dto.order_no,           // order_no
      dto.amount,             // amount
      'ETH',                  // country (ETH for Ethiopia)
      'ETB',                  // currency (ETB for Ethiopian Birr)
      'SALE',                 // txn_type
      dto.success_url,        // success_url
      dto.failure_url,        // failure_url
      'WEB'                   // channel (WEB or MOBILE)
    ].join('|');

    // 2. Payment Gateway Details (pg_details) - Empty for Aggregator Hosted
    const pg_details = [
      '',  // pg_id
      '',  // paymode
      '',  // scheme
      '',  // wallet_type
    ].join('|');

    // 3. Card Details (card_details) - Empty for Aggregator Hosted
    const card_details = [
      '',  // card_no
      '',  // exp_month
      '',  // exp_year
      '',  // cvv
      '',  // card_name
    ].join('|');

    // 4. Customer Details (cust_details)
    const cust_details = [
      dto.customer_name || '',  // cust_name
      dto.email_id,             // email_id
      dto.mobile_no,            // mobile_no
      '',                       // unique_id
      'Y'                       // is_logged_in (Y/N)
    ].join('|');

    // 5. Billing Details (bill_details)
    const bill_details = [
      dto.bill_address || '',   // bill_address
      dto.bill_city || '',      // bill_city
      dto.bill_state || '',     // bill_state
      dto.bill_country || 'ETH', // bill_country
      dto.bill_zip || '',       // bill_zip
    ].join('|');

    // 6. Shipping Details (ship_details) - Empty for now
    const ship_details = [
      '',  // ship_address
      '',  // ship_city
      '',  // ship_state
      '',  // ship_country
      '',  // ship_zip
      '',  // ship_days
      ''   // address_count
    ].join('|');

    // 7. Item Details (item_details) - Empty for now
    const item_details = [
      '',  // item_count
      '',  // item_value
      '',  // item_category
    ].join('|');

    // 8. UPI Details (upi_details) - Empty for non-UPI payments
    const upi_details = '';

    // 9. Other Details (other_details) - UDF fields
    const other_details = [
      '',  // udf_1
      '',  // udf_2
      '',  // udf_3
      '',  // udf_4
      '',  // udf_5
    ].join('|');

    // Combine all sections with ~ as separator (exact format from docs)
    const combined = [
      txn_details,
      pg_details,
      card_details,
      cust_details,
      bill_details,
      ship_details,
      item_details,
      upi_details,
      other_details
    ].join('~');

    return combined;
  }

  generateHash(merchantId: string, orderNo: string, amount: string): string {
    // According to YagoutPay docs: hash_input = merchantId~orderNumber~amount~CURRENCY_FROM~CURRENCY_TO
    const hashInput = `${merchantId}~${orderNo}~${amount}~ETH~ETB`;
    
    // Create SHA256 hash of the input string
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256').update(hashInput, 'utf8').digest('hex');
    
    // Encrypt the hash using AES-256-CBC
    const keyBase64 = this.configService.get<string>('yagout.encryptionKeyBase64', '');
    return aes256CbcEncryptToBase64(hash, keyBase64, this.iv);
  }

  initiate(dto: InitiatePaymentDto): InitiateResponse {
    const merchantId = this.configService.get<string>('yagout.merchantId', '');
    const keyBase64 = this.configService.get<string>('yagout.encryptionKeyBase64', '');
    const postUrl = this.configService.get<string>('yagout.uatPostUrl', '');

    const combined = this.buildSections(dto);
    const encrypted = aes256CbcEncryptToBase64(combined, keyBase64, this.iv);
    const hash = this.generateHash(merchantId, dto.order_no, dto.amount);

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


