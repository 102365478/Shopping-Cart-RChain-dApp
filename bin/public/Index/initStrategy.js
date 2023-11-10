// 策略接口
class BodyStrategy {
    createBody(name, value) {
        throw new Error("You have to implement the method!");
    }
}

// 策略类
class Flag1Strategy extends BodyStrategy {
    createBody(name, value) {
        return {
            name: name,
        };
    }
}

class Flag2Strategy extends BodyStrategy {
    createBody(name, value) {
        return {
            name: name,
            value: value,
        };
    }
}

class InitialBody {
    constructor() {
        console.log("InitBody has generated.");
    }

    init(strategy, name, value) {
        return strategy.createBody(name, value);
    }
}

class GetsTool {
    constructor() {
        console.log("GetTool has generated.");
    }

    getName(username) {
        if (username != null) {
            return document.getElementById(username).value;
        } else {
            console.log("Name is null.");
        }
        return null;
    }
}

export var initialBody = new InitialBody();
export var getsTool = new GetsTool();
export var flag1Strategy = new Flag1Strategy();
export var flag2Strategy = new Flag2Strategy();