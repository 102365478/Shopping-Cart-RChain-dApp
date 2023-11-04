import { initBody} from './strategy.js';
import { getUserName } from './strategy.js';
import { processPost } from './postTemplate.js';

const container = document.querySelector('#container');
const signInButton = document.querySelector('#signIn');
const signUpButton = document.querySelector('#signUp');

signUpButton.addEventListener('click', () => container.classList.add('right-panel-active'));
signInButton.addEventListener('click', async function(){
    container.classList.remove('right-panel-active');
});

const new_dep = async (name) => {
   let body = initBody(1,name);
   var newName = '/new/' + name;
   console.log(newName);

   processPost(newName,null,body,'print');
}

const get = async (name) => {
    let body = initBody(1,name);

    var srcName = "/get/1/" + name;
    console.log(srcName);

    processPost(srcName,name,body,'setNameAndMoney');
}

const set = async (name, value) => {
    let body = initBody(2,name,value);

    var srcNameAndValue = "/set/" + name + "/" + value;
    console.log(value);
    console.log(srcNameAndValue);

    processPost(srcNameAndValue,null,body,'print');
}

let username;

document.getElementById('login_btn').addEventListener('click', async function(){
    username = getUserName("login_text");
    let body = initBody(1,null);
    await get(`${username}`);
});

document.getElementById('reg_btn').addEventListener('click', async function(){
    username = getUserName("reg_text");

    new_dep(`${username}`).then(
        () => {
            set(`${username}`, 100);
        }
    );
});