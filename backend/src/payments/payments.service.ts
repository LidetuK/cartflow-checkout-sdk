import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { ApiPaymentDto } from './dto/api-payment.dto';
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
    
    const encryptionKey = this.configService.get('YAGOUT_ENCRYPTION_KEY');
    if (!encryptionKey) {
      throw new Error('YAGOUT_ENCRYPTION_KEY is not configured');
    }
    
    const encryptedString = this.cryptoUtil.aes256CbcEncryptToBase64(
      combinedString,
      encryptionKey
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
      status: 'initiated',
      integration_type: 'hosted'
    });
    
    const merchantId = this.configService.get('YAGOUT_MERCHANT_ID');
    const postUrl = this.configService.get('YAGOUT_POST_URL');
    
    if (!merchantId) {
      throw new Error('YAGOUT_MERCHANT_ID is not configured');
    }
    if (!postUrl) {
      throw new Error('YAGOUT_POST_URL is not configured');
    }
    
    return {
      me_id: merchantId,
      merchant_request: encryptedString,
      hash: hash,
      post_url: postUrl,
    };
  }

  async encryptApiData(dto: ApiPaymentDto) {
    const merchantId = this.configService.get('YAGOUT_MERCHANT_ID');
    const encryptionKey = this.configService.get('YAGOUT_ENCRYPTION_KEY');
    
    if (!merchantId) {
      throw new Error('YAGOUT_MERCHANT_ID is not configured');
    }
    if (!encryptionKey) {
      throw new Error('YAGOUT_ENCRYPTION_KEY is not configured');
    }

    console.log('🔑 Using Merchant ID:', merchantId);
    console.log('🔐 Encryption Key (first 20 chars):', encryptionKey?.substring(0, 20) + '...');

    // Build the JSON request structure as per YagoutPay documentation
    const requestData = {
      card_details: {
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
        cardName: ""
      },
      other_details: {
        udf1: dto.udf_1 || "",
        udf2: dto.udf_2 || "",
        udf3: dto.udf_3 || "",
        udf4: dto.udf_4 || "",
        udf5: dto.udf_5 || "",
        udf6: dto.udf_6 || "",
        udf7: dto.udf_7 || ""
      },
      ship_details: {
        shipAddress: dto.ship_address || "",
        shipCity: dto.ship_city || "",
        shipState: dto.ship_state || "",
        shipCountry: dto.ship_country || "",
        shipZip: dto.ship_zip || "",
        shipDays: dto.ship_days || "",
        addressCount: dto.address_count || ""
      },
      txn_details: {
        agId: "yagout",
        meId: merchantId,
        orderNo: dto.order_no,
        amount: dto.amount,
        country: "ETH",
        currency: "ETB",
        transactionType: "SALE",
        sucessUrl: "",
        failureUrl: "",
        channel: "API"
      },
      item_details: {
        itemCount: dto.item_count || "",
        itemValue: dto.item_value || "",
        itemCategory: dto.item_category || "General"
      },
      cust_details: {
        customerName: dto.customer_name || "",
        emailId: dto.email_id,
        mobileNumber: dto.mobile_no,
        uniqueId: "",
        isLoggedIn: "Y"
      },
      pg_details: {
        pg_Id: dto.pg_id || "",
        paymode: dto.paymode || "",
        scheme_Id: dto.scheme_id || "",
        wallet_type: dto.wallet_type || ""
      },
      bill_details: {
        billAddress: dto.bill_address || "",
        billCity: dto.bill_city || "",
        billState: dto.bill_state || "",
        billCountry: dto.bill_country || "",
        billZip: dto.bill_zip || ""
      }
    };

    console.log('API Request data before encryption:', JSON.stringify(requestData, null, 2));

    // Convert to JSON string and encrypt
    const jsonString = JSON.stringify(requestData);
    const encryptedRequest = this.cryptoUtil.aes256CbcEncryptToBase64(
      jsonString,
      encryptionKey
    );

    console.log('🔐 Encrypted request (first 50 chars):', encryptedRequest.substring(0, 50) + '...');

    // Return just the encrypted data for testing
    return {
      merchantId: merchantId,
      merchantRequest: encryptedRequest,
      originalData: requestData,
      encryptedLength: encryptedRequest.length
    };
  }

  async initiateApiPayment(dto: ApiPaymentDto) {
    const merchantId = this.configService.get('YAGOUT_MERCHANT_ID');
    const encryptionKey = this.configService.get('YAGOUT_ENCRYPTION_KEY');
    const apiUrl = this.configService.get('yagout.apiUrl') || process.env.YAGOUT_API_URL;
    
    if (!merchantId) {
      throw new Error('YAGOUT_MERCHANT_ID is not configured');
    }
    if (!encryptionKey) {
      throw new Error('YAGOUT_ENCRYPTION_KEY is not configured');
    }
    if (!apiUrl) {
      throw new Error('YAGOUT_API_URL is not configured');
    }

    console.log('🔗 Calling YagoutPay API URL:', apiUrl);
    console.log('🔑 Using Merchant ID:', merchantId);
    console.log('🔐 Encryption Key (first 20 chars):', encryptionKey?.substring(0, 20) + '...');

    // Build the JSON request structure as per YagoutPay documentation
    const requestData = {
      card_details: {
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
        cardName: ""
      },
      other_details: {
        udf1: dto.udf_1 || "",
        udf2: dto.udf_2 || "",
        udf3: dto.udf_3 || "",
        udf4: dto.udf_4 || "",
        udf5: dto.udf_5 || "",
        udf6: dto.udf_6 || "",
        udf7: dto.udf_7 || ""
      },
      ship_details: {
        shipAddress: dto.ship_address || "",
        shipCity: dto.ship_city || "",
        shipState: dto.ship_state || "",
        shipCountry: dto.ship_country || "",
        shipZip: dto.ship_zip || "",
        shipDays: dto.ship_days || "",
        addressCount: dto.address_count || ""
      },
      txn_details: {
        agId: "yagout",
        meId: merchantId,
        orderNo: dto.order_no,
        amount: dto.amount,
        country: "ETH",
        currency: "ETB",
        transactionType: "SALE",
        sucessUrl: "",
        failureUrl: "",
        channel: "API"
      },
      item_details: {
        itemCount: dto.item_count || "",
        itemValue: dto.item_value || "",
        itemCategory: dto.item_category || ""
      },
      cust_details: {
        customerName: dto.customer_name || "",
        emailId: dto.email_id,
        mobileNumber: dto.mobile_no,
        uniqueId: "",
        isLoggedIn: "Y"
      },
      pg_details: {
        pg_Id: dto.pg_id || "67ee846571e740418d688c3f",
        paymode: dto.paymode || "WA",
        scheme_Id: dto.scheme_id || "7",
        wallet_type: dto.wallet_type || "telebirr"
      },
      bill_details: {
        billAddress: dto.bill_address || "",
        billCity: dto.bill_city || "",
        billState: dto.bill_state || "",
        billCountry: dto.bill_country || "",
        billZip: dto.bill_zip || ""
      }
    };

    console.log('API Request data before encryption:', JSON.stringify(requestData, null, 2));

    // Convert to JSON string and encrypt
    const jsonString = JSON.stringify(requestData);
    const encryptedRequest = this.cryptoUtil.aes256CbcEncryptToBase64(
      jsonString,
      encryptionKey
    );

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
      status: 'initiated',
      integration_type: 'api'
    });

    // Make the API call to YagoutPay
    try {
      // Use https module directly to bypass SSL issues
      const https = require('https');
      const url = require('url');
      
      const parsedUrl = url.parse(apiUrl);
      // According to YagoutPay documentation, the request should be:
      // { "merchantId": "your_merchant_id", "merchantRequest": "encrypted_data" }
      const postData = JSON.stringify({
        merchantId: merchantId,
        merchantRequest: encryptedRequest
      });

      console.log('🔐 Encrypted request (first 50 chars):', encryptedRequest.substring(0, 50) + '...');
      console.log('📤 Sending request to:', apiUrl);
      console.log('📋 Request payload:', postData);

      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 443,
        path: parsedUrl.path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        },
        rejectUnauthorized: false // Disable SSL verification
      };

      return new Promise((resolve, reject) => {
        const req = https.request(options, (res: any) => {
          let data = '';
          
          res.on('data', (chunk: any) => {
            data += chunk;
          });
          
          res.on('end', async () => {
            try {
              const responseData = JSON.parse(data);
              console.log('YagoutPay API Response:', responseData);

              // Decrypt the response if it contains encrypted data
              if (responseData.response) {
                try {
                  const decryptedResponse = this.cryptoUtil.aes256CbcDecryptFromBase64(
                    responseData.response,
                    encryptionKey
                  );
                  console.log('Decrypted response:', decryptedResponse);
                  
                  // Parse the decrypted response
                  const parsedResponse = JSON.parse(decryptedResponse);
                  
                  // Update transaction status based on response
                  if (responseData.status === 'Success') {
                    await this.updateTransactionStatus(dto.order_no, 'success', parsedResponse.transactionId);
                  } else {
                    await this.updateTransactionStatus(dto.order_no, 'failed');
                  }

                  resolve({
                    status: responseData.status,
                    statusMessage: responseData.statusMessage,
                    transactionId: parsedResponse.transactionId,
                    orderId: dto.order_no,
                    amount: dto.amount,
                    decryptedResponse: parsedResponse
                  });
                } catch (decryptError) {
                  console.error('Error decrypting response:', decryptError);
                  resolve({
                    status: responseData.status,
                    statusMessage: responseData.statusMessage,
                    encryptedResponse: responseData.response
                  });
                }
              } else {
                resolve(responseData);
              }
            } catch (error) {
              reject(new Error(`Failed to parse response: ${error}`));
            }
          });
        });

        req.on('error', (error: any) => {
          console.error('Error calling YagoutPay API:', error);
          reject(new Error(`Payment processing failed: ${error.message}`));
        });

        req.write(postData);
        req.end();
      });
    } catch (error) {
      console.error('Error calling YagoutPay API:', error);
      await this.updateTransactionStatus(dto.order_no, 'failed');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Payment processing failed: ${errorMessage}`);
    }
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

  async updateTransactionStatus(orderNo: string, status: 'success' | 'failed' | 'failure', transactionId?: string) {
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
    
    // Update transaction status - convert 'failure' to 'failed' for consistency
    const status = type === 'failure' ? 'failed' : type;
    await this.updateTransactionStatus(orderId, status, transactionId);
    
    // If there's encrypted merchant_response, decrypt it
    if (callbackData.merchant_response) {
      try {
        const encryptionKey = this.configService.get('YAGOUT_ENCRYPTION_KEY');
        if (!encryptionKey) {
          throw new Error('YAGOUT_ENCRYPTION_KEY is not configured');
        }
        
        const decrypted = this.cryptoUtil.aes256CbcDecryptFromBase64(
          callbackData.merchant_response,
          encryptionKey
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
    if (!merchantId) {
      throw new Error('YAGOUT_MERCHANT_ID is not configured');
    }
    
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
    const encryptionKey = this.configService.get('YAGOUT_ENCRYPTION_KEY');
    
    if (!merchantId) {
      throw new Error('YAGOUT_MERCHANT_ID is not configured');
    }
    if (!encryptionKey) {
      throw new Error('YAGOUT_ENCRYPTION_KEY is not configured');
    }
    
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
      encryptionKey
    );
    
    return encryptedHash;
  }
}


