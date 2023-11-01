// do makePost() and process the returned value
export function processPost(arg1,arg2,body,process) {
    // arg1 : the first argument of makePost()
    // arg2 ... : the additional arguments that will be processed
    // body : the second argument of makePost()
    // process : the way of processing the returned value
    makePost(arg1,body).then(
        ret => {
            processFunc(ret,process,arg2);
        }
    )
}

// processing the returned value according to the 'process'
function processFunc(ret,process,arg2) {

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

export function makePost(route, body) {
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
  
    return fetch(route, request)
      .then(ret => {
        return ret.json();
      });
  }