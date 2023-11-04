const Context = require('./Context.js');
const DiscountCoupon = require('./DiscountCoupon.js');


//下面是具体的使用方法示例

//创建一个优惠券仓库，这个仓库需要有一个get方法，用于根据优惠券ID获取优惠券信息
class CouponRepository {
    constructor() {
        this.coupons = {
            '0': {type: 'DiscountCoupon', config: '{"discount": 0, "maxReductionAmount": 0}'},
            '1': {type: 'DiscountCoupon', config: '{"discount": 100}'},
            '2': {type: 'DiscountToCoupon', config: '{"DiscountTo": 10}'},
            // 其他优惠券...
        };
    }

    get(couponId) {
        return this.coupons[couponId];
    }
}
//创建一个优惠券计算器工厂，并注册所有的优惠券计算器
let couponCalculateFactory = new Context.CouponCalculateFactory();
couponCalculateFactory.register('DiscountCoupon', new DiscountCoupon.DiscountCoupon());
couponCalculateFactory.register('DiscountToCoupon', new DiscountCoupon.DiscountToCoupon());
//注册其他优惠券计算器...

//创建一个优惠券服务，并传入优惠券仓库和优惠券计算器工厂
let couponRepository = new CouponRepository();
var couponService = new Context.CouponService(couponRepository, couponCalculateFactory);

module.exports = {
	couponService
};


//使用方法
// let quantity = 2;
// let sellingPrice = 100;
// let couponId = '2';

// let result = couponService.calculate(quantity, sellingPrice, couponId);
// console.log(result);