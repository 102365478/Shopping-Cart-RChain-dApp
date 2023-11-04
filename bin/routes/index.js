var express = require('express');
const bodyParser = require('body-parser');
const cliProgress = require('cli-progress');


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
  var bar1 = new cliProgress.SingleBar({format: '{name}: [{bar}] {percentage}% | {workingname} | ETA: {eta}s |\n'}
  , cliProgress.Presets.shades_classic);
  bar1.start(200, 0, {name: "newitem", workingname: "newitem"});
  

  var temp1 = localStorage.getItem("username");
  //temp1 = parseInt(temp1);
  temp1 = temp1.substring(1, temp1.length - 1);

  var temppic;

  await uploadImage(req.body.pic).then(
    (ret) => {
      temppic = ret;
    }
  );

  bar1.update(100, {name: "newitem", workingname: "uploadImage"});
  

  var a = {
  "id": req.body.name,
  "seller": temp1,
  "description": req.body.name + " are <span class=\"label label-info\">" + req.body.price + " each</span>",
  "price": req.body.price,
  "count": req.body.count,
  "title": req.body.name,
  "url": temppic
  }

  products.unshift(a);
  
  await setter.setter("products", encodeURI(JSON.stringify(products)));
  
  bar1.update(200, {name: "newitem", workingname: "setproducts"});
  

  bar1.stop();

  res.end();

});

router.get('/buy/:sellername/:itemid/:price/:itemcountbef/:couponId', async (req, res, next) => {
  var bar1 = new cliProgress.SingleBar({format: '{name}: [{bar}] {percentage}% | {workingname} | ETA: {eta}s |\n'}
  , cliProgress.Presets.shades_classic);
  bar1.start(500, 0, {name: "buy", workingname: "buy"});

  var temp = localStorage.getItem("money");
  var money  = JSON.parse(temp);
  var a = JSON.parse(req.params.price);

  let quantity = 1;
  let sellingPrice = a;
  let couponId = req.params.couponId;

  a = Coupon.couponService.calculate(quantity, sellingPrice, couponId);

  if ( req.params.itemcountbef <= 0 ) {
    // document.getElementById("soldout").style.display = "none";
    bar1.update(500, {name: "buy", workingname: "less than 0"});
    bar1.stop();
    
    return;
  }

  var s;
  var b;
  
  await setter.getter(req.params.sellername).then(
    (ret) => {
      bar1.update(100, {name: "buy", workingname: "get seller money"});
      

      if (ret == "NaN" || ret == "null" || ret == NaN || ret == null) { ret = 0; }
      
      s = parseInt(ret);
      b = parseInt(ret) + a;
    }
  );  

  await setter.setter(req.params.sellername, b).then(
    (ret) => {
      bar1.update(200, {name: "buy", workingname: "set seller money"});
      

      for ( i = 0; i < products.length; ++i ) {

        if ( products[i].title == req.params.itemid ) {
          products[i].count = req.params.itemcountbef - 1;

          if ( products[i].count == 0 ) {
            products[i].description = "<span class=\"label label-danger\">Sold Out!</span>";
          }

          break;
        }
      }
    }
  );

  var temp1 = localStorage.getItem("username");
  temp1 = temp1.substring(1, temp1.length - 1);

  var c = money - a;


  await setter.setter("products", encodeURI(JSON.stringify(products))).then(
    () => {
      bar1.update(300, {name: "buy", workingname: "set products"});
    }
  );

  await setter.getter("products").then(
    (res) => {
      bar1.update(400, {name: "buy", workingname: "get products"});
    }
  );

  await setter.setter(temp1, c).then(
    (ret) => {
      bar1.update(500, {name: "buy", workingname: "set buyer money"});
      
      bar1.stop();
      
      money = money - a;
      localStorage.setItem("money", JSON.stringify(money));
      res.redirect('/main/');
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

router.get('/get/:type/:id', async (req, res1, next) => {
  var bar1 = new cliProgress.SingleBar({format: '{name}: [{bar}] {percentage}% | {workingname} | ETA: {eta}s |\n'}
  , cliProgress.Presets.shades_classic);
  bar1.start(200, 0, {name: "get", workingname: "get"});
  

  var re;

  await setter.getter(req.params.id).then( (ret) => { re = ret; } );
  bar1.update(100, {name: "get", workingname: "get money"});
  


  if (req.params.type == 1) {

    localStorage.setItem("username", JSON.stringify(req.params.id));
    localStorage.setItem("money", JSON.stringify(re));

    await setter.getter("products").then( (res) => { products = JSON.parse(decodeURI(res)); } );
    

  } else if (req.params.type == 2) {

  } else if (req.params.type == 3) {

  }

  bar1.update(200, {name: "get", workingname: "update localstorage"});
  
  bar1.stop();

  return re;

});

router.get('/set/:id/:value', async (req, res, next) => {
  var bar1 = new cliProgress.SingleBar({format: '{name}: [{bar}] {percentage}% | {workingname} | ETA: {eta}s |\n'}
  , cliProgress.Presets.shades_classic);
  bar1.start(100, 0, {name: "set", workingname: "set"});
  

  await setter.setter(req.params.id, req.params.value);

  bar1.update(100, {name: "set", workingname: "set " + req.params.id});
  
  bar1.stop();
});

router.get('/new/:id', async (req, res, next) => {
  var bar1 = new cliProgress.SingleBar({format: '{name}: [{bar}] {percentage}% | {workingname} | ETA: {eta}s |\n'}
  , cliProgress.Presets.shades_classic);
  bar1.start(100, 0, {name: "new", workingname: "new"});
  
  await setter.new_deploy(req.params.id);

  bar1.update(100, {name: "new", workingname: "new " + req.params.id});
  
  bar1.stop();
});

router.get('/init', async (req, res, next) => {
  var bar1 = new cliProgress.SingleBar({format: '{name}: [{bar}] {percentage}% | {workingname} | ETA: {eta}s |\n'}
  , cliProgress.Presets.shades_classic);
  bar1.start(300, 0, {name: "init", workingname: "init"});
  
  await setter.new_deploy("products");
  bar1.update(100, {name: "init", workingname: "new products"});

  await setter.setter("products", encodeURI(JSON.stringify(products)));
  bar1.update(200, {name: "init", workingname: "set products"});

  await setter.getter("products");
  bar1.update(300, {name: "init", workingname: "get products"});
  
  bar1.stop();
});

router.get('/setproducts', async (req, res, next) => {
  var bar1 = new cliProgress.SingleBar({format: '{name}: [{bar}] {percentage}% | {workingname} | ETA: {eta}s |\n'}
  , cliProgress.Presets.shades_classic);
  bar1.start(100, 0, {name: "setproducts", workingname: "setproducts"});
  
	await setter.setter("products", encodeURI(JSON.stringify(products)));

  bar1.update(100, {name: "setproducts", workingname: "set products"});
  

  bar1.stop();
});


module.exports = router;