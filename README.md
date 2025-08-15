# Yagout Pay SDK Code Sprint Challenge 2025

A comprehensive payment integration solution for Ethiopian mobile payment methods (Telebirr, CBE Birr, M-PESA) using YagoutPay's Aggregator Hosted (Non-Seamless) payment gateway.

## 🚀 Features

- **Ethiopian Mobile Payment Integration**: Support for Telebirr, CBE Birr, and M-PESA
- **Modern React Frontend**: Built with React 18, TypeScript, and Vite
- **NestJS Backend**: Robust API with encryption and transaction management
- **Real-time Transaction Tracking**: Dynamic success/failure pages with transaction details
- **Responsive Design**: Mobile-first approach with beautiful UI/UX
- **Security**: AES-256-CBC encryption and SHA-256 hashing
- **Receipt Generation**: Downloadable payment receipts
- **Error Handling**: Comprehensive error management and user guidance

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Shadcn/ui** - Modern component library

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe development
- **Node.js Crypto** - Built-in encryption/hashing
- **Joi** - Environment variable validation
- **class-validator** - DTO validation
- **Railway** - Cloud deployment platform

### Payment Integration
- **YagoutPay API** - Ethiopian payment gateway
- **AES-256-CBC** - Encryption algorithm
- **SHA-256** - Hashing for integrity
- **Base64 Encoding** - Data encoding
- **Form-based Redirect** - Payment flow

## 📁 Project Structure

```
yagout-pay-sdk/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   │   ├── yagout_ca.html   # Success page
│   │   ├── yagout_ca_failure.html # Failure page
│   │   └── index.html       # Main HTML file
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── types/          # TypeScript interfaces
│   │   └── App.tsx         # Main app component
│   ├── package.json        # Frontend dependencies
│   └── vite.config.ts      # Vite configuration
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── payments/       # Payment module
│   │   │   ├── dto/        # Data transfer objects
│   │   │   ├── utils/      # Utility functions
│   │   │   ├── payments.controller.ts
│   │   │   ├── payments.service.ts
│   │   │   └── payments.module.ts
│   │   └── main.ts         # Application entry point
│   ├── package.json        # Backend dependencies
│   └── README.md           # Backend documentation
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yagout-pay-sdk
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:4000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   PORT=4000
   YAGOUT_MERCHANT_ID=your_merchant_id
   YAGOUT_ENCRYPTION_KEY=your_base64_encryption_key
   YAGOUT_POST_URL=https://uatcheckout.yagoutpay.com/payment
   FRONTEND_URL=http://localhost:8080
   ```

4. **Start development server**
   ```bash
   npm run start:dev
   ```

5. **Verify backend is running**
   Visit `http://localhost:4000/payments/test`

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:4000
```

#### Backend (.env)
```env
PORT=4000
YAGOUT_MERCHANT_ID=your_merchant_id
YAGOUT_ENCRYPTION_KEY=your_base64_encryption_key
YAGOUT_POST_URL=https://uatcheckout.yagoutpay.com/payment
FRONTEND_URL=http://localhost:8080
```

### YagoutPay Credentials

To get your YagoutPay credentials:

1. Register at [YagoutPay](https://yagoutpay.com)
2. Contact support for merchant ID and encryption key
3. Configure your success and failure URLs
4. Test in UAT environment first

## 📱 Payment Flow

1. **User selects products** and proceeds to checkout
2. **Frontend collects** customer information and payment method
3. **Backend processes** the payment request:
   - Builds YagoutPay-compatible request sections
   - Encrypts data using AES-256-CBC
   - Generates SHA-256 hash
4. **Form submission** to YagoutPay gateway
5. **User completes** payment on YagoutPay platform
6. **Callback handling** with transaction details
7. **Success/Failure** pages display results

## 🔐 Security Features

- **AES-256-CBC Encryption**: All sensitive data encrypted
- **SHA-256 Hashing**: Data integrity verification
- **Base64 Encoding**: Secure data transmission
- **Input Validation**: Comprehensive DTO validation
- **CORS Protection**: Cross-origin request security
- **Environment Variables**: Secure credential management

## 🎨 UI/UX Features

- **Modern Design**: Glassmorphism and gradient effects
- **Responsive Layout**: Works on all device sizes
- **Loading States**: Smooth user experience
- **Error Handling**: User-friendly error messages
- **Animations**: Engaging micro-interactions
- **Accessibility**: WCAG compliant design

## 📊 API Endpoints

### Backend API

- `POST /payments/initiate` - Initialize payment
- `GET /payments/transaction/:orderNo` - Get transaction details
- `POST /payments/callback/success` - Success callback
- `POST /payments/callback/failure` - Failure callback
- `GET /payments/test` - Health check

### Request/Response Examples

#### Payment Initiation
```json
{
  "order_no": "ORD-123456789",
  "amount": "1.00",
  "success_url": "http://localhost:8080/yagout_ca.html",
  "failure_url": "http://localhost:8080/yagout_ca_failure.html",
  "customer_name": "John Doe",
  "email_id": "john@example.com",
  "mobile_no": "251912345678"
}
```

#### Payment Response
```json
{
  "me_id": "your_merchant_id",
  "merchant_request": "encrypted_data",
  "hash": "generated_hash",
  "post_url": "https://uatcheckout.yagoutpay.com/payment"
}
```

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Connect repository** to Vercel
2. **Set build settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. **Configure environment variables**
4. **Deploy**

### Backend Deployment (Railway)

1. **Connect repository** to Railway
2. **Set root directory** to `backend`
3. **Configure environment variables**
4. **Deploy**

### Environment Variables for Production

```env
# Frontend
VITE_API_BASE_URL=https://your-backend-url.com

# Backend
PORT=4000
YAGOUT_MERCHANT_ID=your_production_merchant_id
YAGOUT_ENCRYPTION_KEY=your_production_encryption_key
YAGOUT_POST_URL=https://checkout.yagoutpay.com/payment
FRONTEND_URL=https://your-frontend-url.com
```

## 🧪 Testing

### Manual Testing

1. **Start both servers** (frontend and backend)
2. **Navigate to** `http://localhost:8080`
3. **Select products** and proceed to checkout
4. **Fill customer information** and select payment method
5. **Complete payment** on YagoutPay test environment
6. **Verify success/failure** pages display correctly

### API Testing

```bash
# Test backend health
curl http://localhost:4000/payments/test

# Test payment initiation
curl -X POST http://localhost:4000/payments/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "order_no": "TEST-123",
    "amount": "1.00",
    "success_url": "http://localhost:8080/yagout_ca.html",
    "failure_url": "http://localhost:8080/yagout_ca_failure.html",
    "customer_name": "Test User",
    "email_id": "test@example.com",
    "mobile_no": "251912345678"
  }'
```

## 🔧 Development

### Available Scripts

#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

#### Backend
```bash
npm run start:dev    # Start development server
npm run build        # Build TypeScript
npm run start        # Start production server
npm run test         # Run tests
```

### Code Structure

- **Components**: Reusable UI components
- **Pages**: Main application views
- **Types**: TypeScript interfaces
- **Utils**: Helper functions
- **Services**: API integration logic

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**


## 🆘 Support

- **Documentation**: [YagoutPay API Docs](https://yagoutpay.com/docs)
- **Issues**: Create an issue in this repository
- **Email**: support@yagoutpay.com
- **Website**: [https://yagoutpay.com](https://yagoutpay.com)

## 🙏 Contact

- **Email** lidetuketema495@gmail.com
- **Phone nmuber** 0972315453