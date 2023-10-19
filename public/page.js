"use strict"

document.addEventListener("DOMContentLoaded", () => {

  // Grab DOM items
  let global_A = document.getElementById('global_A');
  let global_B = document.getElementById('global_B');
  //TODO Add controls for call later

  // Event Listeners
  document.getElementById('get_A').addEventListener('click', function(){get("A", global_A);});
  document.getElementById('set_A').addEventListener('click', function(){set("A", global_A);});
  document.getElementById('get_B').addEventListener('click', function(){get("B", global_B);});
  document.getElementById('set_B').addEventListener('click', function(){set("B", global_B);});
  document.getElementById('new').addEventListener('click', function(){makePost('/new');});
  
  function get(name, value){
    let body = {
      name: name,
      value: value.value,
    };

    // Actually send it
    makePost('/get', body)
    .then(res => {
      console.log(res);
      value.value = res;
    });

    // Clear the DOM to prevent double posts
    value.value = "";
  };

  function set(name, value){
    let body = {
      name: name,
      value: value.value,
    }

    makePost('/set', body)
    .then(res => {
      console.log(res);
    });

    value.value = "";
  };

  //TODO Add event handler to make a call later

  /**
   * Abstract the boring part of making a post request
   * @param route The request destination as a string. ex: '/call'
   * @param body An object of the data to be passed
   * @return A promise for a response object
   */
  function makePost(route, body){
    let request = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(body)
    };
    // console.log("heres");

    return fetch(route, request)
    .then(res => {return res.json()});
  };
});
