// initialize body
export function initBody(flag, name, value) {
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

// get username
export function getUserName(username) {
    if(username != null){
      return document.getElementById(username).value;
    }
    else{
      console.log('Name is null.')
    }
    return null;
}

