# YagoutPay Integration Backend

A NestJS backend service for integrating with YagoutPay's Aggregator Hosted (Non-Seamless) payment gateway for Ethiopian mobile payments.

## 🏗️ Architecture Overview

This backend implements YagoutPay's payment flow with AES-256-CBC encryption and SHA-256 hashing for secure transaction processing.

### Tech Stack
- **Framework**: NestJS 10.x
- **Language**: TypeScript
- **Encryption**: AES-256-CBC with PKCS#7 padding
- **Hashing**: SHA-256 (hex format)
- **Validation**: class-validator with Joi schema validation
- **Configuration**: Environment-based with validation

## 🔐 Encryption & Security

### AES-256-CBC Encryption
- **Algorithm**: AES-256-CBC
- **Key**: Base64 decoded merchant encryption key
- **IV**: Static `0123456789abcdef` (16 bytes)
- **Padding**: PKCS#7
- **Output**: Base64 encoded encrypted string

### Hash Generation Process
1. **Hash Input Construction**: `merchantId~orderNumber~amount~CURRENCY_FROM~CURRENCY_TO`
   - Example: `202508080001~ORD-123456~1.10~ETH~ETB`
2. **SHA-256 Hashing**: Creates 64-character hex string
3. **Hash Encryption**: Encrypts the hex hash using AES-256-CBC
4. **Final Output**: Base64 encoded encrypted hash

### Crypto Utilities (`src/payments/utils/crypto.util.ts`)
```typescript
// AES-256-CBC encryption to Base64
aes256CbcEncryptToBase64(plainText, keyBase64, iv)

// AES-256-CBC decryption from Base64  
aes256CbcDecryptFromBase64(encryptedBase64, keyBase64, iv)

// SHA-256 hash to Base64
sha256Base64(inputBase64)
```

## 📡 API Endpoints

### POST `/payments/initiate`
Initiates a payment transaction with YagoutPay.

**Request Body:**
```json
{
  "order_no": "ORD-123456",
  "amount": "1.10",
  "success_url": "https://yourdomain.com/success",
  "failure_url": "https://yourdomain.com/failure",
  "customer_name": "John Doe",
  "email_id": "john@example.com",
  "mobile_no": "972315453",
  "bill_address": "123 Main St",
  "bill_city": "Addis Ababa",
  "bill_state": "Addis Ababa",
  "bill_country": "ETH",
  "bill_zip": "1000"
}
```

**Response:**
```json
{
  "me_id": "202508080001",
  "merchant_request": "encrypted_base64_string",
  "hash": "encrypted_hash_base64",
  "post_url": "https://uatcheckout.yagoutpay.com/ms-transaction-core-1-0/paymentRedirection/checksumGatewayPage"
}
```

### POST `/payments/callback`
Receives payment response from YagoutPay (for testing).

**Request Body:**
```json
{
  "merchant_response": "encrypted_response_string"
}
```

## 🔧 Configuration

### Environment Variables
```env
PORT=4000
YAGOUT_MERCHANT_ID=202508080001
YAGOUT_ENCRYPTION_KEY=IG3CNW5uNrUO2mU2htUOWb9rgXCF7XMAXmL63d7wNZo=
YAGOUT_AGGREGATOR_ID=yagout
YAGOUT_POST_URL=https://uatcheckout.yagoutpay.com/ms-transaction-core-1-0/paymentRedirection/checksumGatewayPage
```

### Configuration Service (`src/config/`)
- **configuration.ts**: Loads environment variables
- **validation.ts**: Joi schema validation for env vars

## 📦 Payload Structure

The backend constructs the encrypted payload according to YagoutPay's specification:

### Transaction Details (txn_details)
```
ag_id|me_id|order_no|amount|country|currency|txn_type|success_url|failure_url|channel
```
Example: `yagout|202508080001|ORD-123|1.10|ETH|ETB|SALE|https://...|https://...|WEB`

### Customer Details (cust_details)
```
cust_name|email_id|mobile_no|unique_id|is_logged_in
```
Example: `John Doe|john@example.com|972315453||Y`

### Billing Details (bill_details)
```
bill_address|bill_city|bill_state|bill_country|bill_zip
```
Example: `123 Main St|Addis Ababa|Addis Ababa|ETH|1000`

### Complete Payload
All sections are joined with `~` separator:
```
txn_details~pg_details~card_details~cust_details~bill_details~ship_details~item_details~upi_details~other_details
```

## 🚀 Deployment

### Local Development
```bash
cd backend
npm install
npm run start:dev
```

### Railway Deployment
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
cd backend
railway init
railway up

# Set environment variables
railway variables set YAGOUT_MERCHANT_ID=your_merchant_id
railway variables set YAGOUT_ENCRYPTION_KEY=your_encryption_key
railway variables set YAGOUT_AGGREGATOR_ID=yagout
railway variables set YAGOUT_POST_URL=https://uatcheckout.yagoutpay.com/ms-transaction-core-1-0/paymentRedirection/checksumGatewayPage
```

### Production Build
```bash
npm run build
npm start
```

## 🔍 Testing

### Test Payment Initiation
```bash
curl -X POST http://localhost:4000/payments/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "order_no": "ORD-TEST-001",
    "amount": "1.00",
    "success_url": "http://localhost:8080/success",
    "failure_url": "http://localhost:8080/failure",
    "customer_name": "Test User",
    "email_id": "test@example.com",
    "mobile_no": "972315453"
  }'
```

### Test Callback Decryption
```bash
curl -X POST http://localhost:4000/payments/callback \
  -H "Content-Type: application/json" \
  -d '{
    "merchant_response": "encrypted_response_string"
  }'
```

## 🔄 Payment Flow

1. **Frontend** sends payment request to `/payments/initiate`
2. **Backend** validates request and builds encrypted payload
3. **Backend** returns encrypted data and YagoutPay URL
4. **Frontend** submits form to YagoutPay's hosted page
5. **User** selects mobile wallet (telebirr, CBE Birr, M-PESA)
6. **YagoutPay** processes payment and redirects to success/failure URL
7. **Frontend** displays result page

## 🛡️ Security Features

- **Input Validation**: DTO validation with class-validator
- **Environment Validation**: Joi schema validation for config
- **AES-256-CBC Encryption**: Bank-level encryption for sensitive data
- **SHA-256 Hashing**: Secure hash generation for data integrity
- **CORS Protection**: Configurable CORS settings
- **Helmet Security**: HTTP security headers

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── configuration.ts    # Environment configuration
│   │   └── validation.ts       # Joi validation schemas
│   ├── payments/
│   │   ├── dto/
│   │   │   └── initiate-payment.dto.ts  # Request validation
│   │   ├── utils/
│   │   │   └── crypto.util.ts  # Encryption utilities
│   │   ├── payments.controller.ts       # API endpoints
│   │   ├── payments.service.ts          # Business logic
│   │   └── payments.module.ts           # Module definition
│   ├── app.module.ts           # Root module
│   └── main.ts                 # Application entry point
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Dependencies

### Core Dependencies
- `@nestjs/common`: NestJS core functionality
- `@nestjs/config`: Configuration management
- `class-validator`: Request validation
- `class-transformer`: Data transformation
- `joi`: Environment validation
- `crypto`: Node.js crypto module for encryption

### Development Dependencies
- `@types/cors`: CORS type definitions
- `@nestjs/platform-express`: Express platform
- `typescript`: TypeScript compiler
- `ts-node-dev`: Development server

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid Encryption" Error**
   - Check encryption key format (must be Base64)
   - Verify payload structure matches YagoutPay spec
   - Ensure all required fields are present

2. **"Invalid Hash" Error**
   - Verify hash generation follows YagoutPay format
   - Check merchant ID, order number, and amount format
   - Ensure currency codes are correct (ETH, ETB)

3. **"Phone number should not include country code"**
   - Frontend should strip country code (251) before sending
   - Send only local number (e.g., 972315453)

4. **Validation Errors**
   - Check DTO validation rules
   - Ensure amount has exactly 2 decimal places
   - Verify email format and phone number length

## 📞 Support

For YagoutPay integration issues:
- Check YagoutPay documentation
- Verify merchant credentials
- Test with minimal amounts first
- Contact YagoutPay support for gateway issues

---

**Built with ❤️ for Ethiopian mobile payments**
