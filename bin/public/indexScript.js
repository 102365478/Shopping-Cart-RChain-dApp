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
   var newName = '/new/1/' + name;
   console.log(newName);

   await processPost(newName,null,body,'print');
}

const get = async (name) => {
    let body = initBody(1,name);

    var srcName = "/get/1/" + name;
    console.log(srcName);

    await processPost(srcName,name,body,'setNameAndMoney');
}

const set = async (name, value) => {
    let body = initBody(2,name,value);

    var srcNameAndValue = "/set/" + name + "/" + value;
    console.log(value);
    console.log(srcNameAndValue);

    await processPost(srcNameAndValue,null,body,'print');
}

let username;

document.getElementById('login_btn').addEventListener('click', async () => {
    var loading = document.getElementById("login_loading");
    loading.style.display = 'block';

    username = getUserName("login_text");

    get(`${username}`);

    loading.style.display = 'none';
});

document.getElementById('reg_btn').addEventListener('click', async () => {
    var loading = document.getElementById("reg_loading");
    loading.style.display = 'block';

    username = getUserName("reg_text");

    new_dep(`${username}`);

    loading.style.display = 'none';
});