import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(4000),
  YAGOUT_MERCHANT_ID: Joi.string().required(),
  YAGOUT_ENCRYPTION_KEY: Joi.string().required(),
  YAGOUT_AGGREGATOR_ID: Joi.string().default('yagout'),
  YAGOUT_POST_URL: Joi.string().uri().required(),
  YAGOUT_API_URL: Joi.string().uri().required(),
});


