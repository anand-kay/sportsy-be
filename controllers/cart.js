const mongoose = require('mongoose');

const UserModel = require('../models/user');
const ProductModel = require('../models/product');

// Add product to cart
exports.addToCart = (req, res, next) => {
    req.user.addToCart(req.body.prodid, req.body.quantity).then((isSuccess) => {
        if(isSuccess) {
            res.status(200).send(req.user.cartitems);
        }
        else {
            res.status(400).send();
        }

    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    });

};

// Edit quantity in cart
exports.editCart = (req, res, next) => {
    const prodid = req.body.prodid;
    const newQuantity = req.body.newquantity;

    UserModel.update({
        'cartitems._prodid': prodid
    }, 
    {
        '$set': {
            'cartitems.$.quantity': newQuantity
        }
    }).then(() => {
        res.status(200).send();
    }).catch(() => {
        res.status(400).send();
    });

};

// Remove product from cart
exports.removeFromCart = (req, res, next) => {
    const prodid = req.body.prodid;

    req.user.update({
        '$pull': {
            'cartitems': { 
                '_prodid': prodid 
            }
        }
    }).then(() => {
        res.status(200).send();
    }).catch(() => {
        res.status(400).send();
    });

};

// Get cart
exports.getCart = (req, res, next) => {

    const tempCartitems = [];

    req.user.cartitems.forEach((cartitem) => {
        tempCartitems.push(cartitem['_prodid']);
        
    });

    ProductModel.find({
        _id: {
            $in: tempCartitems
        }
    }).then((products) => {
        const productsLength = products.length;

        let responseArray = [];

        for(let i = 0; i < productsLength; i++)
        {
            responseArray.push({
                epoch: req.user.cartitems[i].epoch,
                quantity: req.user.cartitems[i].quantity,
                product: products[i]
            });
        }

        res.send(responseArray);

    }).catch((err) => {
        res.status(400).send(err);
    });

};