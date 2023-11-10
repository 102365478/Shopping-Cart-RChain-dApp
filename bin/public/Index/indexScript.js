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
    }else{Swal.fire('Not exist.','用户名不存在.','question');}
    
    if(exist == true && match == true){
        let body = initialBody.init(1,null);
        await get(`${username}`, password);
    }
    else if(exist == true && match == false){Swal.fire('Wrong password!','密码错误!','error');}
});

document.getElementById('reg_btn').addEventListener('click', async function(){
    username = getsTool.getName("reg_text");
    password = getsTool.getName("pwd");

    var accountFlag = actChain.process(username);
    var passwordFlag = pwdChain.process(password);

    switch(accountFlag){
        case 'noNumber':
            Swal.fire('Without number...', '用户名缺少数字...', 'warning');
            ;break;
        case 'noLetter':
            Swal.fire('Without letter...', '用户名缺少字母...', 'warning');break;
        case 'noBoth':
            Swal.fire('Without number and letter...', '用户名缺少数字和字母...', 'warning');break;
        default :    
            switch(passwordFlag){
            case 'wrong':
                Swal.fire('Password not allowed!','密码不合法!','warning');break;
            default : break ;
            };
    }
    idmap.forEach((value,key)=>{
        if(key == username){
            Swal.fire('Already registered name.','用户名已被注册.','info');
            accountFlag = 'RegisterAgain';
        }
    })

    if(accountFlag == 'complete' && passwordFlag == 'right'){
        idmap.set(username,password);
        await new_dep(`${username}`, password);
    }
});