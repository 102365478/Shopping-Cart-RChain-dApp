class PostTool {

    constructor(arg1,arg2,body,process){
        this.arg1 = arg1;
        this.arg2 = arg2;
        this.body = body;
        this.process = process;
    }

    makePost(route, body)  {
        if(body==null){
          console.log('Body is null.');
        }
    
        let request = {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
          }
        };
    
        console.log("makepost() before return");
    
    
        return fetch(route, request)
          .then(ret => {
            console.log("makepost() in return then");
            //return ret.json();
          });
      }

    processPost(arg1,arg2,body,process) {
        // arg1 : the first argument of makePost()
        // arg2 ... : the additional arguments that will be processed
        // body : the second argument of makePost()
        // process : the way of processing the returned value
        this.makePost(arg1,body).then(
            ret => {
                this.processRet(ret,process,arg2);
            }
        )
    }

    processRet(ret,process,arg2) {

        if(ret == null){
            console.log('[processFunc] Ret is null.');
        }
    
        if(process == 'print'){
            //print the returned value
            ret => {
                console.log(ret);
            }
        }
        else if(process == 'setNameAndMoney'){
            //set username and moeny 
            ret => {
                localStorage.setItem("username", JSON.stringify(arg2));
                localStorage.setItem("money", JSON.stringify(ret));
                return ret;
            }
        }
    }


}

export var postTool = new PostTool();