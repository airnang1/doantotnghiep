import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { MainValidationPipe } from '../../pipes';
import { CouponService } from './coupon.service';
import { CouponsQueryDto } from './dto';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get()
  @UsePipes(new MainValidationPipe())
  async getCoupons(@Query() query: CouponsQueryDto) {
    return [];
    // return this.couponService.getCoupons(query);
  }

  // @Patch(':code/flags')
  // @UsePipes(new MainValidationPipe())
  // async updateCouponFlags(@Param('code') code: string, @Body() body: UpdateCouponFlagsDto) {
  //   return this.couponService.updateCouponFlags(code, body);
  // }
}
