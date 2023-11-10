import { formatCheck } from "./FormatCheck.js";
import { Handler } from "./CheckChain.js";


export class CompleteHandler extends Handler {
    handle(request) {
        return 'complete';
    }
}

export class noNumberHandler extends Handler {
    handle(request) {
        const hasNumber = formatCheck.numberCheck(request);
        if (!hasNumber) {
            return 'noNumber';
        }
        return super.handle(request);
    }
}

export class noLetterHandler extends Handler {
    handle(request) {
        const hasLetter = formatCheck.letterCheck(request);
        if (!hasLetter) {
            return 'noLetter';
        }
        return super.handle(request);
    }
}

export class lengthEnoughHandler extends Handler {
    handle(request) {
        const lengthEnough = formatCheck.lengthCheck(request);
        if (!lengthEnough) {
            return 'wrong';
        }
        return super.handle(request);
    }
}