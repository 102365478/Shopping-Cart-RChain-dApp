var express = require('express');
const bodyParser = require('body-parser');
var http = require('http');

var router = express.Router();
var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
window = dom.window;
document = window.document;
XMLHttpRequest = window.XMLHttpRequest;

const cliProgress = require('cli-progress');
const cloudinary = require('cloudinary').v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true
});

var fs = require('fs');

var Cart = require('../models/cart');
var products = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));
const setter = require("../../lib/setter.js");

const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');

const Coupon = require('../public/Coupons/Service.js');
const { resolve } = require('path');

const load = async () => {
  const rho_deploy = require('../../lib/rho_deploy.js');
  rho_deploy.func_deploy_fromfile('../rho/cart.rho', -1);
}

const uploadImage = async (imagePath) => {

    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
		use_filename: true,
		unique_filename: false,
		overwrite: true,
    };

    try {
		// Upload the image
      var result = await cloudinary.uploader.upload(imagePath, options);
      return result.url;
    } catch (error) {
      console.error(error);
    }
};

router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/main/', async function (req, res, next) {
    var temp = localStorage.getItem("money");
    var tem = JSON.parse(temp);
    var temp1 = localStorage.getItem("username");
    temp1 = temp1.substring(1, temp1.length - 1);

    res.render('main', 
      { 
      title: 'NodeJS Shopping Cart',
      products: products,
      username: temp1,
      money: tem,
      coupuns: JSON.parse(Math.round(Math.random() * 2)),
      }
    );

});

router.get('/add/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var product = products.filter(function(item) {
    return item.id == productId;
  });
  cart.add(product[0], productId);
  req.session.cart = cart;
  res.redirect('/main/');
});

router.post('/newitem', async function (req, res) {
  var bar1 = new cliProgress.SingleBar({format: '{name}: [{bar}] {percentage}% | ETA: {eta}s | {workingname} |\n {src}\n'}
  , cliProgress.Presets.shades_classic);
  bar1.start(200, 0, {name: "newitem", workingname: "newitem", src: ""});
  

  var username = localStorage.getItem("username");
  //temp1 = parseInt(temp1);
  username = username.substring(1, username.length - 1);

  var temppic;

  await uploadImage(req.body.pic).then(
    (ret) => {
      temppic = ret;
      bar1.update(100, {name: "newitem", workingname: "uploadImage", src: ret});
    }
  );

  var newitem = {
  "id": req.body.name,
  "seller": username,
  "description": req.body.name + " are <span class=\"label label-info\">" + req.body.price + " each</span>",
  "price": req.body.price,
  "count": req.body.count,
  "title": req.body.name,
  "url": temppic
  }

  products.unshift(newitem);
  
  await setter.setter("products", encodeURI(JSON.stringify(products))).then(
    ret => {
      bar1.update(200, {name: "newitem", workingname: "setproducts", src : ret.src});
    }
  );
  
  bar1.stop();

  res.end();

});

router.get('/buy/:sellername/:itemid/:price/:itemcountbef/:couponId', async (req, res, next) => {
  var bar1 = new cliProgress.SingleBar({format: '{name}: [{bar}] {percentage}% | ETA: {eta}s | {workingname} |\n {src}\n'}
  , cliProgress.Presets.shades_classic);
  bar1.start(400, 0, {name: "buy", workingname: "buy", src: ""});
  var barcount = 0;

  var buyermoney  = JSON.parse(localStorage.getItem("money"));
  var buyername = localStorage.getItem("username");
  buyername = buyername.substring(1, buyername.length - 1);
  
  let quantity = 1;
  let couponId = req.params.couponId;

  var itemmoneyafter = Coupon.couponService.calculate(quantity, JSON.parse(req.params.price), couponId);

  if ( req.params.itemcountbef <= 0 ) {
    // document.getElementById("soldout").style.display = "none";
    bar1.update(400, {name: "buy", workingname: "less than 0"});
    bar1.stop();
    
    res.redirect('/main/');
    res.end();
    return;
  } else if ( req.params.sellername == buyername ) {
    bar1.update(400, {name: "buy", workingname: "seller equals buyer"});
    bar1.stop();
    
    res.redirect('/main/');
    res.end();
    return;
  }

  for ( i = 0; i < products.length; ++i ) {
    if ( products[i].title == req.params.itemid ) {
      products[i].count = req.params.itemcountbef - 1;

      if ( products[i].count == 0 ) {
        products[i].description = "<span class=\"label label-danger\">Sold Out!</span>";
      }

      break;
    }
  }

  var sellermoneyafter;
  
  setter.getter(req.params.sellername).then(
    (ret) => {
      barcount += 100;
      bar1.update(barcount, {name: "buy", workingname: "get seller money", src : ret.src});
      if( barcount == 400 ) {
        bar1.stop();
      }
      
      if (ret.ret == "NaN" || ret.ret == "null" || ret.ret == NaN || ret.ret == null) { ret.ret = 0; }
      
      sellermoneyafter = parseInt(ret.ret) + itemmoneyafter;

      setter.setter(req.params.sellername, sellermoneyafter).then(
        (ret) => {
          barcount += 100;
          bar1.update(barcount, {name: "buy", workingname: "set seller money", src : ret.src});
          if( barcount == 400 ) {
            bar1.stop();
          }
        }
      );
    }
  );  

  await setter.setter(buyername, buyermoney - itemmoneyafter).then(
    (ret) => {
      barcount += 100;
      bar1.update(barcount, {name: "buy", workingname: "set buyer money", src : ret.src});
      if( barcount == 400 ) {
        bar1.stop();
      }
      
      buyermoney = buyermoney - itemmoneyafter;
      localStorage.setItem("money", JSON.stringify(buyermoney));

      setter.setter("products", encodeURI(JSON.stringify(products))).then(
        (ret) => {
          barcount += 100;
          bar1.update(barcount, {name: "buy", workingname: "set products", src : ret.src});
          if( barcount == 400 ) {
            bar1.stop();
            res.redirect('/main/');
          }
        }
      );
    }
  );
});

router.get('/cart', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('cart', {
      products: null
    });
  }
  var cart = new Cart(req.session.cart);
  res.render('cart', {
    title: 'NodeJS Shopping Cart',
    products: cart.getItems(),
    totalPrice: cart.totalPrice
  });
});

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.remove(productId);
  req.session.cart = cart;
  res.redirect('/cart');
});

// login in
router.get('/get/:type/:id/:pw', async (req, res, next) => {
  var bar1 = new cliProgress.SingleBar({format: '{name}: [{bar}] {percentage}% | ETA: {eta}s | {workingname} |\n {src}\n'}
  , cliProgress.Presets.shades_classic);
  bar1.start(200, 0, {name: "get", workingname: "get", src: ""});
  var barcount = 0;
  var usermoney;

  await setter.getter(req.params.id).then( 
    (ret) => { 
      usermoney = ret.ret; 
      barcount += 100;
      bar1.update(barcount, {name: "get", workingname: "get money", src : ret.src});
      if( barcount == 200 ) {
        bar1.stop();
      }
    } 
  );
  
  
  if (req.params.type == 1) {

    localStorage.setItem("username", JSON.stringify(req.params.id));
    localStorage.setItem("money", JSON.stringify(usermoney));

    await setter.getter("products").then( 
      (ret) => { 
        products = JSON.parse(decodeURI(ret.ret)); 
        barcount += 100;
        bar1.update(barcount, {name: "get", workingname: "update localstorage", src : ret.src});
        if( barcount == 200 ) {
          bar1.stop();
          res.end();
        }
      } 
    );
    

  } else if (req.params.type == 2) {

  } else if (req.params.type == 3) {

  }


});

router.get('/set/:id/:value', async (req, res, next) => {
  var bar1 = new cliProgress.SingleBar({format: '{name}: [{bar}] {percentage}% | ETA: {eta}s | {workingname} |\n {src}\n'}
  , cliProgress.Presets.shades_classic);
  bar1.start(100, 0, {name: "set", workingname: "set", src: ""});
  
  await setter.setter(req.params.id, req.params.value).then(
    (ret) => {
      bar1.update(100, {name: "set", workingname: "set " + req.params.id, src : ret.src});
    }
  );
  
  bar1.stop();
});

// register
router.get('/new/:type/:id/:pw', async (req, res, next) => {
  var bar1 = new cliProgress.SingleBar({format: '{name}: [{bar}] {percentage}% | ETA: {eta}s | {workingname} |\n {src}\n'}
  , cliProgress.Presets.shades_classic);
  switch(req.params.type) {
    case '1': {
      bar1.start(200, 0, {name: "newuser", workingname: "new", src: ""});

      await setter.new_deploy(req.params.id).then(
        (ret) => {
          bar1.update(100, {name: "newuser", workingname: "new " + req.params.id, src : ret.src});
        }
      );

      setter.setter(req.params.id, 100).then(
        (ret) => {
          bar1.update(200, {name: "newuser", workingname: "set " + req.params.id, src : ret.src});
          bar1.stop();
          res.end();
        }
      );
      break;
    }
    case '2': {
      bar1.start(100, 0, {name: "new", workingname: "new", src: ""});

      await setter.new_deploy(req.params.id).then(
        (ret) => {
          bar1.update(100, {name: "new", workingname: "new " + req.params.id, src : ret.src});
          bar1.stop();
        }
      );

      break;
    }
  }

  
});

router.get('/init', async (req, res, next) => {
  var bar1 = new cliProgress.SingleBar({format: '{name}: [{bar}] {percentage}% | ETA: {eta}s | {workingname} |\n {src}\n'}
  , cliProgress.Presets.shades_classic);
  bar1.start(300, 0, {name: "init", workingname: "init", src: ""});
  
  await setter.new_deploy("products").then(
    (ret) => {
      bar1.update(100, {name: "init", workingname: "new products", src : ret.src});
    }
  );

  await setter.setter("products", encodeURI(JSON.stringify(products))).then(
    (ret) => {
      bar1.update(200, {name: "init", workingname: "set products", src : ret.src});
    }
  );
  
  await setter.getter("products").then(
    (ret) => {
      bar1.update(300, {name: "init", workingname: "get products", src : ret.src});
    }
  );
  

  bar1.stop();
});

router.get('/setproducts', async (req, res, next) => {
  var bar1 = new cliProgress.SingleBar({format: '{name}: [{bar}] {percentage}% | ETA: {eta}s | {workingname} |\n {src}\n'}
  , cliProgress.Presets.shades_classic);
  bar1.start(100, 0, {name: "setproducts", workingname: "setproducts", src: ""});
  
	await setter.setter("products", encodeURI(JSON.stringify(products))).then(
    (ret) => {
      bar1.update(100, {name: "setproducts", workingname: "set products", src : ret.src});
    }
  );

  bar1.stop();
});

router.get('/buyallincart/:couponId', async (req, res, next) => {
  
}) 



module.exports = router;