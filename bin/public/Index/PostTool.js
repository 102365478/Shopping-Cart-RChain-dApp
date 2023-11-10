class PostTool {
    constructor(arg1, arg2, body, process) {
        this.arg1 = arg1;
        this.arg2 = arg2;
        this.body = body;
        this.process = process;
    }

    makePost(route, body) {
        if (body == null) {
            console.log('Body is null.');
        }

        let request = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            }
        };
        return fetch(route, request)
            .then(ret => {
                //return ret.json();
            });
    }

    processRet(ret, process, arg2) {
        if (ret == null) {
            console.log('[processFunc] Ret is null.');
        }

        if (process == 'print') {
            //print the returned value
            ret => {
                console.log(ret);
            }
        } else if (process == 'setNameAndMoney') {
            //set username and moeny 
            ret => {
                localStorage.setItem("username", JSON.stringify(arg2));
                localStorage.setItem("money", JSON.stringify(ret));
                return ret;
            }
        }
    }

    // 抽象方法，需要在子类中实现
    processPost() {
        throw new Error("You have to implement the method!");
    }
}

class ConcretePostTool extends PostTool {
    processPost(arg1, arg2, body, process) {
        this.makePost(arg1, body).then(
            ret => {
                this.processRet(ret, process, arg2);
            }
        )
    }
}

export var postTool = new ConcretePostTool();