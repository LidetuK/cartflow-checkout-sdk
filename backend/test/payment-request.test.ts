// Simple test script to verify payment request generation
import { PaymentsService } from '../src/payments/payments.service';
import { ConfigService } from '@nestjs/config';

// Mock ConfigService
const mockConfigService = {
  get: (key: string) => {
    switch (key) {
      case 'yagout.merchantId':
        return 'TEST_MERCHANT';
      case 'yagout.encryptionKeyBase64':
        // 32-byte key in base64 (AES-256 requires 32 bytes)
        // This is a 32-byte key: 'yagout-secret-key-32-bytes-long!!' (32 chars)
        // Converted to Buffer and back to base64 to ensure correct length
        const key = Buffer.from('yagout-secret-key-32-bytes-long!!');
        return key.toString('base64');
      case 'yagout.aggregatorId':
        return 'yagout';
      case 'yagout.uatPostUrl':
        return 'https://uatcheckout.yagoutpay.com/ms-transaction-core-1-0/paymentRedirection/checksumGatewayPage';
      default:
        return null;
    }
  },
} as unknown as ConfigService;

// Create test instance
const service = new PaymentsService(mockConfigService);

// Test payment data
const paymentDto = {
  order_no: 'TEST' + Date.now(),
  amount: '100.00',
  success_url: 'https://example.com/success',
  failure_url: 'https://example.com/failure',
  customer_name: 'Test User',
  email_id: 'test@example.com',
  mobile_no: '251911223344',
  bill_address: 'Test Address',
  bill_city: 'Addis Ababa',
  bill_state: 'Addis Ababa',
  bill_country: 'ETH',
  bill_zip: '1000',
  udf1: 'Test UDF1',
  udf2: 'Test UDF2',
};

console.log('Generating payment request with data:', JSON.stringify(paymentDto, null, 2));

// Generate and log the payment request
try {
  const result = service.initiate(paymentDto as any);
  console.log('\nPayment Request Result:');
  console.log(JSON.stringify(result, null, 2));
  
  // Basic validation
  if (!result.me_id || !result.merchant_request || !result.hash || !result.post_url) {
    throw new Error('Missing required fields in payment response');
  }
  
  console.log('\n✅ Payment request generated successfully!');
  
  // Log the encryption key details for debugging
  const encryptionKey = mockConfigService.get('yagout.encryptionKeyBase64');
  const keyBuffer = Buffer.from(encryptionKey, 'base64');
  console.log(`Encryption Key (base64): ${encryptionKey}`);
  console.log(`Key length (bytes): ${keyBuffer.length}`);
  
  // Try to decrypt the request for verification
  try {
    const decrypted = (service as any).decryptCallbackPayload(result.merchant_request);
    console.log('\nDecrypted Request:');
    console.log(decrypted);
    
    // Verify decrypted data contains original values
    if (!decrypted.includes(paymentDto.order_no) || 
        !decrypted.includes(paymentDto.amount) || 
        !decrypted.includes(paymentDto.customer_name)) {
      console.warn('⚠️  Warning: Some expected values not found in decrypted data');
    } else {
      console.log('✅ Decryption verified successfully!');
    }
  } catch (error: any) {
    console.error('❌ Decryption failed:', error.message);
  }
  
} catch (error: any) {
  console.error('❌ Error generating payment request:', error);
  process.exit(1);
}

