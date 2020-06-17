const stripe = require('stripe')('sk_test_ajIodmbnBiAFiVn7eXEPdIfl00xqYS6Bw1');

const ProductModel = require('../models/product');

// Make payment
exports.makePayment = (req, res, next) => {

    const tempCartitems = [];

    let totalPrice = 0;

    req.user.cartitems.forEach((cartitem) => {
        tempCartitems.push(cartitem['_prodid']);

    });

    ProductModel.find({
        _id: {
            $in: tempCartitems
        }
    }).then((products) => {

        // console.log(products);

        products.forEach((product) => {

            totalPrice += product.price;

        });

        const charge = stripe.charges.create({
            amount: totalPrice * 100,
            currency: 'usd',
            source: req.body.token
        }).then((charge) => {

            req.user.cartitems = undefined;

            req.user.save().then(() => {

                res.send(charge);

            });

        }).catch((err) => {
            console.log(err);

            res.status(400).send(err);

        });

    });

};