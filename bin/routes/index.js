var express = require('express');
const bodyParser = require('body-parser');
const cliProgress = require('cli-progress');
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

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
    console.log("this function 1");

    // console.log("hi " + temp1 + " " + tem);

    res.render('main', 
      { 
      title: 'NodeJS Shopping Cart',
      products: products,
      username: temp1,
      money: tem,
      }
    );

    
    console.log("this function 2");
    
    
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
  bar1.start(300, 0);

  bar1.update(100);
  console.log();

  var temp1 = localStorage.getItem("username");
  //temp1 = parseInt(temp1);
  temp1 = temp1.substring(1, temp1.length - 1);

  var temppic;

  await uploadImage(req.body.pic).then(
    (ret) => {
      temppic = ret;
    }
  );

  bar1.update(200);
  console.log();

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
  
  bar1.update(300);
  console.log();

  bar1.stop();

  res.end();

});


router.get('/buy/:sellername/:itemid/:price/:itemcountbef/:couponId', async (req, res, next) => {
  bar1.start(500, 0);
  console.log();

  var temp = localStorage.getItem("money");
  var money  = JSON.parse(temp);
  var a = JSON.parse(req.params.price);

  let quantity = 1;
  let sellingPrice = a;
  let couponId = req.params.couponId;

  a = Coupon.couponService.calculate(quantity, sellingPrice, couponId);

  if ( req.params.itemcountbef <= 0 ) {
    // document.getElementById("soldout").style.display = "none";
    bar1.update(500);
    bar1.stop();
    console.log();
    return;
  }

  var s;
  var b;
  
  await setter.getter(req.params.sellername).then(
    (ret) => {
      bar1.update(100);
      console.log();

      if (ret == "NaN" || ret == "null" || ret == NaN || ret == null) { ret = 0; }
      
      s = parseInt(ret);
      b = parseInt(ret) + a;
    }
  );  

  await setter.setter(req.params.sellername, b).then(
    (ret) => {
      bar1.update(200);
      console.log();

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
  var c = money - a;


  await setter.setter("products", encodeURI(JSON.stringify(products))).then(
    () => {
      bar1.update(300);
      console.log();
        
      temp1 = temp1.substring(1, temp1.length - 1);
    }
  );

  await setter.getter("products").then(
    (res) => {
      bar1.update(400);
      console.log();
    }
  );

  await setter.setter(temp1, c).then(
    (ret) => {
      bar1.update(500);
      console.log();
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

router.get('/get/:type/:id', function(req, res1, next) {
  setter.getter(req.params.id).then(
    (ret) => {
      // res.end("\"" + "get: " + req.params.id + " " + ret + "\n" + "\"");
      console.log("get: " + req.params.id + " " + ret + "\n");
      
      if (req.params.type == 1) {
        localStorage.setItem("username", JSON.stringify(req.params.id));
        localStorage.setItem("money", JSON.stringify(ret));
        setter.getter("products").then(
          (res) => {
            products = JSON.parse(decodeURI(res));
			      console.log(products);

            var temp = localStorage.getItem("money");
            var tem = JSON.parse(temp);
            var temp1 = localStorage.getItem("username");
            temp1 = temp1.substring(1, temp1.length - 1);
            console.log("this function 1");
    
            // console.log("hi " + temp1 + " " + tem);
    
            res1.render('main', 
              { 
              title: 'NodeJS Shopping Cart',
              products: products,
              username: temp1,
              money: tem,
              }
            );


          }
        );
        // res.redirect('/main/');
        

      } else if (req.params.type == 2) {

      } else if (req.params.type == 3) {

      }
      
      
      return ret;
    }
  );
});

router.get('/set/:id/:value', (req, res, next) => {
  setter.setter(req.params.id, req.params.value).then(
    () => {
      // res.end("\"" + "set: " + req.params.id + " " + req.params.value + "\n" + "\"");
      console.log("set: " + req.params.id + " " + req.params.value + "\n");
    }
  );
});

router.get('/new/:id', (req, res, next) => {
  setter.new_deploy(req.params.id);
  console.log("new_deploy: " + req.params.id + "\n");
});

router.get('/init', (req, res, next) => {
  setter.new_deploy("products").then(
    () => {
      console.log("new_deploy: " + "products" + "\n");
  
      setter.setter("products", encodeURI(JSON.stringify(products))).then(
        () => {
          console.log("set: " + "products" + "\n" + encodeURI(JSON.stringify(products)) +  "\n");
          setter.getter("products").then(
            (res) => {
              	console.log(res);
            }
          );
        }
      );
    }
  );
});

router.get('/setproducts', (req, res, next) => {
	setter.setter("products", encodeURI(JSON.stringify(products))).then(
		() => {
			console.log("set: " + "products" + "\n" + encodeURI(JSON.stringify(products)) +  "\n");
		}
	);
});







module.exports = router;

