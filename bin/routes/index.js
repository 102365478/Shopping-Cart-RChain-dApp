var express = require('express');
const bodyParser = require('body-parser');

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

const rho_deploy = require('../../lib/rho_deploy.js');
const setter = require("../../lib/setter.js");
const coder = require('../../lib/coder.js');

const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');

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
		const result = await cloudinary.uploader.upload(imagePath, options);
		return result.url;
    } catch (error) {
      	console.error(error);
    }
};

const getAssetInfo = async (publicId) => {

    // Return colors in the response
    const options = {
      colors: true,
    };

    try {
        // Get details about the asset
        const result = await cloudinary.api.resource(publicId, options);
        console.log(result);
        return result.colors;
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


    // console.log("hi " + temp1 + " " + tem);


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
  var temp1 = localStorage.getItem("username");
  //temp1 = parseInt(temp1);
  temp1 = temp1.substring(1, temp1.length - 1);

  var temppic;

  await uploadImage(req.body.pic).then(
    (ret) => {
      temppic = ret;
    }
  );

  console.log(temppic);

  var a = {
  "id": req.body.name,
  "seller": temp1,
  "description": req.body.name + " are <span class=\"label label-info\">" + req.body.price + " each</span>",
  "price": req.body.price,
  "count": req.body.count,
  "title": req.body.name,
  "url": temppic
  }

  console.log('newitem: ' +  req.body.name + " " + req.body.price + " " + req.body.count);

  products.unshift(a);
  
  console.log(products);

  await setter.setter("products", encodeURI(JSON.stringify(products)));

  res.end();

});


router.get('/buy/:sellername/:itemid/:price/:itemcountbef', function(req, res, next) {
  var temp = localStorage.getItem("money");
  var money  = JSON.parse(temp);
  var a = JSON.parse(req.params.price);

  if ( req.params.itemcountbef <= 0 ) {
    // document.getElementById("soldout").style.display = "none";
    return;
  }
  
  setter.getter(req.params.sellername).then(
    (ret) => {
      // console.log("getB" + ret);
      if (ret == "NaN" || ret == "null") { ret = 0; }
      var s = parseInt(ret);
      var b = parseInt(ret) + a;
      setter.setter(req.params.sellername, b).then(
        (ret) => {
          // res.end("\"" + "set: " + req.params.id + " " + req.params.value + "\n" + "\"");
          console.log("set: " + req.params.sellername + " " + JSON.parse(s) + " + " + a + " " + b + "\n");
          var str = "" + a + "," + (req.params.itemcountbef - 1);
          

			for ( i = 0; i < products.length; ++i ) {
				// console.log(products[i]);
				if ( products[i].title == req.params.itemid ) {
				products[i].count = req.params.itemcountbef - 1;
				if ( products[i].count == 0 ) {
					products[i].description = "<span class=\"label label-danger\">Sold Out!</span>";
				}
				// console.log(products[i]);
				break;
				}
			}

			setter.setter("products", encodeURI(JSON.stringify(products))).then(
				() => {
					console.log("set: " + "products" + "\n" + encodeURI(JSON.stringify(products)) +  "\n");
					  setter.getter("products").then(
						(res) => {
							console.log(res);
						}
					);


					var c = money - a;

					var temp1 = localStorage.getItem("username");
	  
					temp1 = temp1.substring(1, temp1.length - 1);
	  
					setter.setter(temp1, c).then(
						(ret) => {
							// res.end("\"" + "set: " + req.params.id + " " + req.params.value + "\n" + "\"");
							console.log("set: " + temp1 + " " + money + "-" + a + " " + c + "\n");
							money = money - a;
							localStorage.setItem("money", JSON.stringify(money));
							res.redirect('/main/');
						}
					);
				}
			);


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

router.get('/get/:type/:id', (req, res, next) => {
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

