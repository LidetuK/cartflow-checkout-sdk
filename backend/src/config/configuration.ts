export default () => ({
  port: parseInt(process.env.PORT || '4000', 10),
  yagout: {
    merchantId: process.env.YAGOUT_MERCHANT_ID || '',
    encryptionKeyBase64: process.env.YAGOUT_ENCRYPTION_KEY || '',
    aggregatorId: process.env.YAGOUT_AGGREGATOR_ID || 'yagout',
    uatPostUrl:
      process.env.YAGOUT_POST_URL ||
      'https://uatcheckout.yagoutpay.com/ms-transaction-core-1-0/paymentRedirection/checksumGatewayPage',
    apiUrl:
      process.env.YAGOUT_API_URL ||
      'https://uatcheckout.yagoutpay.com/ms-transaction-core-1-0/apiRedirection/apiIntegration',
  },
});


