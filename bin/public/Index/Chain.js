import { CompleteHandler, noNumberHandler, noLetterHandler, lengthEnoughHandler} from "./Handlers.js";

class Chain {
    constructor(handler) {
        this.handler = handler;
    }

    process(request) {
        return this.handler.handle(request);
    }
}

const accountCheckHandler = new noNumberHandler();
const noLetter = new noLetterHandler();
const completeHandler = new CompleteHandler();

accountCheckHandler.nextHandler = noLetter;
noLetter.nextHandler = completeHandler;

export const actChain = new Chain(accountCheckHandler);



const passwordCheckHandler = new noNumberHandler();
const noLetter1 = new noLetterHandler();
const lengthEnough1 = new lengthEnoughHandler();
const completeHandler1 = new CompleteHandler();

passwordCheckHandler.nextHandler = noLetter1;
noLetter1.nextHandler = lengthEnough1;
lengthEnough1.nextHandler = completeHandler1;

export const pwChain = new Chain(passwordCheckHandler);