const Context = require('./Context.js');

//定义具体n折券
class DiscountCoupon extends Context.AbstractCouponCalculator {
    constructor() {
        super('DiscountCoupon');
    }

    calculate(params, couponConfig) {
        let totalPrice = this.calculateTotalPrice(params); //折扣之前要付的价钱

        let discount = (1000 - couponConfig.discount) / 1000; //打了多少折扣
        let difference = totalPrice - totalPrice * discount; //优惠了多少钱

        if (couponConfig.maxReductionAmount != null && difference >= couponConfig.maxReductionAmount) {
            //maxReductionAmount是最大优惠金额
            difference = couponConfig.maxReductionAmount;
        }

        let amount = totalPrice - difference; //使用了折扣券之后的价钱

        return amount;
    }
}

//定义具体减至券
class DiscountToCoupon extends Context.AbstractCouponCalculator {
    constructor() {
        super('DiscountToCoupon');
    }

    calculate(params, couponConfig) {
        return couponConfig.DiscountTo;
    }
}

module.exports = {
	DiscountCoupon,
    DiscountToCoupon
};