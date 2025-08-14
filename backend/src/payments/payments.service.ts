import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { CryptoUtil } from './utils/crypto.util';

// In-memory storage for transaction details (in production, use a database)
const transactionStore = new Map<string, any>();

@Injectable()
export class PaymentsService {
  private readonly cryptoUtil: CryptoUtil;

  constructor(private configService: ConfigService) {
    this.cryptoUtil = new CryptoUtil();
  }

  async initiatePayment(dto: InitiatePaymentDto) {
    const sections = this.buildSections(dto);
    const combinedString = sections.join('~');
    
    console.log('Combined string before encryption:', combinedString);
    
    const encryptedString = this.cryptoUtil.aes256CbcEncryptToBase64(
      combinedString,
      this.configService.get('YAGOUT_ENCRYPTION_KEY')
    );
    
    const hash = this.generateHash(dto.order_no, dto.amount);
    
    // Store transaction details for later retrieval
    transactionStore.set(dto.order_no, {
      order_no: dto.order_no,
      amount: dto.amount,
      customer_name: dto.customer_name,
      email_id: dto.email_id,
      mobile_no: dto.mobile_no,
      bill_address: dto.bill_address,
      bill_city: dto.bill_city,
      bill_state: dto.bill_state,
      bill_country: dto.bill_country,
      bill_zip: dto.bill_zip,
      created_at: new Date().toISOString(),
      status: 'initiated'
    });
    
    return {
      me_id: this.configService.get('YAGOUT_MERCHANT_ID'),
      merchant_request: encryptedString,
      hash: hash,
      post_url: this.configService.get('YAGOUT_POST_URL'),
    };
  }

  async getTransactionDetails(orderNo: string) {
    const transaction = transactionStore.get(orderNo);
    if (!transaction) {
      return null;
    }
    
    return {
      ...transaction,
      transaction_id: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      date_time: new Date().toLocaleString()
    };
  }

  async updateTransactionStatus(orderNo: string, status: 'success' | 'failed', transactionId?: string) {
    const transaction = transactionStore.get(orderNo);
    if (transaction) {
      transaction.status = status;
      transaction.transaction_id = transactionId;
      transaction.updated_at = new Date().toISOString();
      transactionStore.set(orderNo, transaction);
    }
  }

  async processCallback(callbackData: any, type: 'success' | 'failure') {
    console.log(`Processing ${type} callback:`, callbackData);
    
    // Extract data from YagoutPay callback
    const orderId = callbackData.order_no || callbackData.order_id || 'unknown';
    const amount = callbackData.amount || '0.00';
    const transactionId = callbackData.transaction_id || callbackData.txn_id || 'unknown';
    const errorCode = callbackData.error_code || 'PAYMENT_FAILED';
    const errorMessage = callbackData.error_message || 'Payment could not be completed';
    
    // Update transaction status
    await this.updateTransactionStatus(orderId, type, transactionId);
    
    // If there's encrypted merchant_response, decrypt it
    if (callbackData.merchant_response) {
      try {
        const decrypted = this.cryptoUtil.aes256CbcDecryptFromBase64(
          callbackData.merchant_response,
          this.configService.get('YAGOUT_ENCRYPTION_KEY')
        );
        console.log('Decrypted merchant_response:', decrypted);
        
        // Parse the decrypted response
        const responseParts = decrypted.split('~');
        // Extract relevant data from decrypted response
        // This depends on YagoutPay's response format
      } catch (error) {
        console.error('Error decrypting merchant_response:', error);
      }
    }
    
    return {
      orderId,
      amount,
      transactionId,
      errorCode,
      errorMessage,
      type
    };
  }

  private buildSections(dto: InitiatePaymentDto): string[] {
    const merchantId = this.configService.get('YAGOUT_MERCHANT_ID');
    
    // Txn_Details: ag_id|me_id|order_no|amount|country|currency|txn_type|success_url|failure_url|channel
    const txnDetails = [
      'yagout', // ag_id
      merchantId, // me_id
      dto.order_no, // order_no
      dto.amount, // amount
      'ETH', // country
      'ETB', // currency
      'SALE', // txn_type
      dto.success_url, // success_url
      dto.failure_url, // failure_url
      'WEB' // channel
    ].join('|');

    // Pg_Details: pg_id|paymode|scheme|wallet_type (all blank for Aggregator Hosted)
    const pgDetails = ['', '', '', ''].join('|');

    // Card_Details: card_no|exp_month|exp_year|cvv|card_name (all blank for Aggregator Hosted)
    const cardDetails = ['', '', '', '', ''].join('|');

    // Cust_Details: cust_name|email_id|mobile_no|unique_id|is_logged_in
    const custDetails = [
      dto.customer_name || '', // cust_name
      dto.email_id, // email_id
      dto.mobile_no, // mobile_no
      '', // unique_id
      'Y' // is_logged_in
    ].join('|');

    // Bill_Details: bill_address|bill_city|bill_state|bill_country|bill_zip
    const billDetails = [
      dto.bill_address || '', // bill_address
      dto.bill_city || '', // bill_city
      dto.bill_state || '', // bill_state
      dto.bill_country || '', // bill_country
      dto.bill_zip || '' // bill_zip
    ].join('|');

    // Ship_Details: ship_address|ship_city|ship_state|ship_country|ship_zip|ship_days|address_count
    const shipDetails = ['', '', '', '', '', '', ''].join('|');

    // Item_Details: item_count|item_value|item_category
    const itemDetails = ['', '', ''].join('|');

    // UPI_Details: upi_id|upi_name
    const upiDetails = ['', ''].join('|');

    // Other_Details: udf_1|udf_2|udf_3|udf_4|udf_5
    const otherDetails = ['', '', '', '', ''].join('|');

    return [
      txnDetails,
      pgDetails,
      cardDetails,
      custDetails,
      billDetails,
      shipDetails,
      itemDetails,
      upiDetails,
      otherDetails
    ];
  }

  private generateHash(orderNumber: string, amount: string): string {
    const merchantId = this.configService.get('YAGOUT_MERCHANT_ID');
    const CURRENCY_FROM = 'ETH';
    const CURRENCY_TO = 'ETB';
    
    // Create hash input string
    const hashInput = `${merchantId}~${orderNumber}~${amount}~${CURRENCY_FROM}~${CURRENCY_TO}`;
    console.log('Hash input:', hashInput);
    
    // Generate SHA-256 hash (hex)
    const sha256Hash = this.cryptoUtil.sha256Hex(hashInput);
    console.log('SHA-256 hash (hex):', sha256Hash);
    
    // Encrypt the hash with AES-256-CBC
    const encryptedHash = this.cryptoUtil.aes256CbcEncryptToBase64(
      sha256Hash,
      this.configService.get('YAGOUT_ENCRYPTION_KEY')
    );
    
    return encryptedHash;
  }
}


