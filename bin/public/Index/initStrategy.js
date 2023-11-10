class InitialBody{
    constructor(){
        console.log("InitBody has generated.");
    }

    init(flag,name,value){
        let body;
        if(flag==1){
          body = {
            name : name,
          };
        }
        else{
          body = {
            name : name,
            value : value,
          };
        }
      
        return body;
    }
}

class GetsTool{
    constructor(){
        console.log("GetTool has generated.");
    }

    getName(username){
        if(username != null){
            return document.getElementById(username).value;
          }
          else{
            console.log("Name is null.");
          }
          return null;
    }
}

export var initialBody = new InitialBody();
export var getsTool = new GetsTool();