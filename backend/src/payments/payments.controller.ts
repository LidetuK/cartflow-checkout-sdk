import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  initiate(@Body() dto: InitiatePaymentDto) {
    return this.paymentsService.initiate(dto);
  }

  // Callback: YagoutPay posts back fields including encrypted merchant_response, hash, etc.
  // For local testing, accept JSON with { merchant_response: string }
  @Post('callback')
  callback(@Body() body: any) {
    const { merchant_response } = body;
    if (!merchant_response) {
      return { ok: false, error: 'merchant_response missing' };
    }
    const decrypted = this.paymentsService.decryptCallbackPayload(merchant_response);
    return { ok: true, decrypted };
  }
}


