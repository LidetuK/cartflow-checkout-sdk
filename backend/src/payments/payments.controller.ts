import { Controller, Post, Body, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { ApiPaymentDto } from './dto/api-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  async initiatePayment(@Body() dto: InitiatePaymentDto) {
    try {
      return await this.paymentsService.initiatePayment(dto);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment initiation failed';
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('api/initiate')
  async initiateApiPayment(@Body() dto: ApiPaymentDto) {
    try {
      return await this.paymentsService.initiateApiPayment(dto);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'API payment initiation failed';
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('api/test')
  async testApiEndpoint() {
    return {
      message: 'API endpoint is working!',
      timestamp: new Date().toISOString(),
      status: 'success'
    };
  }

  @Get('transaction/:orderNo')
  async getTransactionDetails(@Param('orderNo') orderNo: string) {
    try {
    const transaction = await this.paymentsService.getTransactionDetails(orderNo);
    if (!transaction) {
        throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
    }
    return transaction;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Failed to get transaction details';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('callback/success')
  async handleSuccessCallback(@Body() callbackData: any) {
    try {
      return await this.paymentsService.processCallback(callbackData, 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process success callback';
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('callback/failure')
  async handleFailureCallback(@Body() callbackData: any) {
    try {
      return await this.paymentsService.processCallback(callbackData, 'failure');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process failure callback';
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('test')
  async test() {
    return {
      message: 'YagoutPay Payments Service is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  }
}


