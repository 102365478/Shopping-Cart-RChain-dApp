class FormatCheck {
    constructor(){
        console.log("FormatCheck has generated.");
    }

    numberCheck(arg){
        // 检测是否有数字
        var numberReg = /\d/;
        return numberReg.test(arg);
    }

    letterCheck(arg){
        // 检测是否有字母(不分大小写)
        var letterReg = /[a-zA-Z]/
        return letterReg.test(arg);
    }

    lengthCheck(arg){
        // 判断密码长度是否大于五位
        return arg.length > 5 ? true : false ;
    }

}

 export var formatCheck = new FormatCheck();


