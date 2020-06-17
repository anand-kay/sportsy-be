const ProductModel = require('../models/product');

// Add to purchases
exports.addToPurchases = (req, res, next) => {
    const user = req.user;
    const purchasedProducts = req.body.purchases;

    purchasedProducts.forEach((purchasedProduct) => {
        user.purchases.push({
            _prodid: purchasedProduct.prodid,
            price: purchasedProduct.price,
            quantity: purchasedProduct.quantity
        });

    });

    user.save().then((user) => {
        res.send(user.purchases);
    }).catch((err) => {
        res.status(400).send(err);
    });

};

// Get purchases
exports.getPurchases = (req, res, next) => {
    // res.send(req.user.purchases);

    const tempPurchases = [];

    req.user.purchases.forEach((purchase) => {
        tempPurchases.push(purchase['_prodid']);
        
    });

    ProductModel.find({
        _id: {
            $in: tempPurchases
        }
    }).then((products) => {
        const productsLength = products.length;

        let responseArray = [];

        for(let i = 0; i < productsLength; i++)
        {
            responseArray.push({
                epoch: req.user.purchases[i].epoch,
                quantity: req.user.purchases[i].quantity,
                price: req.user.purchases[i].price,
                product: products[i]
            });
        }

        res.send(responseArray);

    }).catch((err) => {
        res.status(400).send(err);
    });

};