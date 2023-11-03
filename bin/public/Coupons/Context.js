//定义一个抽象的优惠券计算器类

class AbstractCouponCalculator {
    constructor(couponType) {
        this.couponType = couponType;
    }

    calculateTotalPrice(params) {
        return params.sellingPrice * params.quantity;
    }

    calculate(params, couponConfig) {
        throw new Error('You have to implement the method calculate!');
    }
}

//定义优惠券计算器工厂

class CouponCalculateFactory {
    constructor() {
        this.calculatorMap = {};
    }

    register(couponType, calculator) {
        this.calculatorMap[couponType] = calculator;
    }

    get(couponType) {
        return this.calculatorMap[couponType];
    }
}

//定义优惠券服务
class CouponService {
    constructor(couponRepository, couponCalculateFactory) {
        this.couponRepository = couponRepository;
        this.couponCalculateFactory = couponCalculateFactory;
    }

    calculate(quantity, sellingPrice, couponId) {
        let coupon = this.couponRepository.get(couponId);
        let couponConfig = JSON.parse(coupon.config);
        let couponCalculator = this.couponCalculateFactory.get(coupon.type);

        let couponCalcParams = {sellingPrice, quantity};
        return couponCalculator.calculate(couponCalcParams, couponConfig);
    }
}


module.exports = {
	AbstractCouponCalculator,
    CouponCalculateFactory,
    CouponService
};
