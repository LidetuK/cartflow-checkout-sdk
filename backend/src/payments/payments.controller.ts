import { Controller, Post, Body, Get, Query, Res, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('test')
  async test() {
    return { message: 'Payments controller is working!' };
  }

  @Get('transaction/:orderNo')
  async getTransactionDetails(@Param('orderNo') orderNo: string) {
    const transaction = await this.paymentsService.getTransactionDetails(orderNo);
    if (!transaction) {
      return { error: 'Transaction not found' };
    }
    return transaction;
  }

  @Post('initiate')
  async initiatePayment(@Body() initiatePaymentDto: InitiatePaymentDto) {
    return this.paymentsService.initiatePayment(initiatePaymentDto);
  }

  @Post('callback/success')
  async handleSuccessCallback(@Body() callbackData: any, @Res() res: Response) {
    try {
      console.log('Success callback received:', callbackData);
      
      // Process the success response
      const result = await this.paymentsService.processCallback(callbackData, 'success');
      
      // Redirect to frontend with success parameters
      const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/success?` + 
        `order_id=${result.orderId}&` +
        `amount=${result.amount}&` +
        `transaction_id=${result.transactionId}&` +
        `status=success`;
      
      console.log('Redirecting to:', redirectUrl);
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Error processing success callback:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/failure?error=callback_error`);
    }
  }

  @Post('callback/failure')
  async handleFailureCallback(@Body() callbackData: any, @Res() res: Response) {
    try {
      console.log('Failure callback received:', callbackData);
      
      // Process the failure response
      const result = await this.paymentsService.processCallback(callbackData, 'failure');
      
      // Redirect to frontend with failure parameters
      const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/failure?` +
        `order_id=${result.orderId}&` +
        `amount=${result.amount}&` +
        `error_code=${result.errorCode}&` +
        `error_message=${encodeURIComponent(result.errorMessage)}`;
      
      console.log('Redirecting to:', redirectUrl);
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Error processing failure callback:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/failure?error=callback_error`);
    }
  }

  @Get('callback/success')
  async handleSuccessCallbackGet(@Query() query: any, @Res() res: Response) {
    // Handle GET requests (fallback)
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/success?` +
      `order_id=${query.order_id || 'unknown'}&` +
      `amount=${query.amount || '0.00'}&` +
      `transaction_id=${query.transaction_id || 'unknown'}&` +
      `status=success`;
    
    console.log('GET Success callback - Redirecting to:', redirectUrl);
    res.redirect(redirectUrl);
  }

  @Get('callback/failure')
  async handleFailureCallbackGet(@Query() query: any, @Res() res: Response) {
    // Handle GET requests (fallback)
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/failure?` +
      `order_id=${query.order_id || 'unknown'}&` +
      `amount=${query.amount || '0.00'}&` +
      `error_code=${query.error_code || 'PAYMENT_FAILED'}&` +
      `error_message=${encodeURIComponent(query.error_message || 'Payment failed')}`;
    
    console.log('GET Failure callback - Redirecting to:', redirectUrl);
    res.redirect(redirectUrl);
  }
}


