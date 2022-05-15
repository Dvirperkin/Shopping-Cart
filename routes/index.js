let express = require('express');
let router = express.Router();
const fetch = require('node-fetch');

let productsList

/* GET home page. */
router.get('/', async function (req, res, next) {
    if(!req.session.inProccess) {
        let response = await fetch("https://fakestoreapi.com/products")
        productsList = await response.json()
        productsList = productsList.map(product => {
            return {...product, quantity: 1}
        })
        req.session.inProccess = true
    }

    //Checks response status code.
    function status(res) {
        if (res.status >= 200 && res.status <= 300) {
            return Promise.resolve(res);
        } else {
            return Promise.reject(res.statusText);
        }
    }

    res.render('index', {title: 'Cart'});
});

router.get('/products', function (req, res, next) {
    return res.json(productsList)
});

router.put('/more:productID', function (req,res,next){
    productsList.forEach(product => {
        if(product.id.toString() === req.params.productID.toString()){
            product.quantity += 1
        }
    })
    res.send({isSuccessful: true})
})

router.put('/less:productID', function (req,res,next){
    productsList.forEach(product => {
        if(product.id.toString() === req.params.productID.toString()){
            product.quantity -= 1
        }
    })
    res.send({isSuccessful: true})
})


router.delete('/del:productID', function (req,res,next) {
    productsList = productsList.filter( product => product.id.toString() !== req.params.productID.toString())
    res.send({isSuccessful: true})
})

module.exports = router;
