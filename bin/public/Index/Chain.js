import { formatCheck } from "./FormatCheck.js";

class Handler {
    constructor(nextHandler = null) {
        this.nextHandler = nextHandler;
    }

    handle(request) {
        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }
        return null;
    }
}
class AccountCheckHandler extends Handler {
    handle(request) {
        const hasNumber = formatCheck.numberCheck(request);
        const hasLetter = formatCheck.letterCheck(request);
        if (hasNumber && hasLetter) {
            return 'complete';
        }
        if (!hasNumber) {
            return 'noNumber';
        }
        if (!hasLetter) {
            return 'noLetter';
        }
        return super.handle(request);
    }
}

class PasswordCheckHandler extends Handler {
    handle(request) {
        const hasNumber = formatCheck.numberCheck(request);
        const hasLetter = formatCheck.letterCheck(request);
        const lengthEnough = formatCheck.lengthCheck(request);
        if (hasNumber && hasLetter && lengthEnough) {
            return 'right';
        }
        return 'wrong';
    }
}

class Chain {
    constructor(handler) {
        this.handler = handler;
    }

    process(request) {
        return this.handler.handle(request);
    }
}

const accountCheckHandler = new AccountCheckHandler();
const passwordCheckHandler = new PasswordCheckHandler();

accountCheckHandler.nextHandler = passwordCheckHandler;

export const actChain = new Chain(accountCheckHandler);
export const pwdChain = new Chain(passwordCheckHandler);
