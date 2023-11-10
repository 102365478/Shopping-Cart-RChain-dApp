import { postTool } from './PostTool.js';
import { initialBody } from './initStrategy.js';
import { getsTool } from './initStrategy.js';
import { actChain,pwdChain } from './Chain.js';
const container = document.querySelector('#container');
const signInButton = document.querySelector('#signIn');
const signUpButton = document.querySelector('#signUp');

var idmap = new Map();

signUpButton.addEventListener('click', () => container.classList.add('right-panel-active'));
signInButton.addEventListener('click', async function(){
    container.classList.remove('right-panel-active');
});

const new_dep = async (name, pw) => {
   let body = initialBody.init(1,name);
   var newName = '/new/1/' + name +"/"+pw;
   console.log(newName);

   postTool.processPost(newName,null,body,'print');
}

const get = async (name,pw) => {
    let body = initialBody.init(1,name);

    var srcName = "/get/1/" + name+"/"+pw;
    console.log(srcName);

    postTool.processPost(srcName,name,body,'setNameAndMoney');
}

const set = async (name, value) => {
    let body = initialBody.init(2,name,value);

    var srcNameAndValue = "/set/" + name + "/" + value;
    console.log(value);
    console.log(srcNameAndValue);

    postTool.processPost(srcNameAndValue,null,body,'print');
}


let username;
let password;

document.getElementById('login_btn').addEventListener('click', async function(){
    username = getsTool.getName("login_text");
    password = getsTool.getName("pwdt");

    let exist = false;
    let match = false;

    idmap.forEach((value,key)=>{
        if(key == username){
            exist = true;
        }
    })

    if(exist == true){
        if(idmap.get(username) == password){
            match = true;
        }
    }else{Swal.fire('Not exist.','Username doesn\'t exist.','question');}
    
    if(exist == true && match == true){
        let body = initialBody.init(1,null);
        await get(`${username}`, password);
    }
    else if(exist == true && match == false){Swal.fire('Wrong!','Password error!','error');}
});

document.getElementById('reg_btn').addEventListener('click', async function(){
    username = getsTool.getName("reg_text");
    password = getsTool.getName("pwd");

    var accountFlag = actChain.process(username);
    var passwordFlag = pwdChain.process(password);

    idmap.forEach((value,key)=>{
        if(key == username){
            Swal.fire('Not allowed','Username existed.','info');
            accountFlag = 'RegisterAgain';
            return;
        }
    })

    switch(accountFlag){
        case 'noNumber':
            Swal.fire('Error', 'Username without number...', 'warning');break;
        case 'noLetter':
            Swal.fire('Error', 'Username without letter...', 'warning');break;
        case 'noBoth':
            Swal.fire('Error', 'Username without number or letter...', 'warning');break;
        default :    
            switch(passwordFlag){
            case 'wrong':
                Swal.fire('Error','Password not allowed!','warning');break;
            default : break ;
            };
    }

    if(accountFlag == 'complete' && passwordFlag == 'right'){
        idmap.set(username,password);
        await new_dep(`${username}`, password);
    }
});