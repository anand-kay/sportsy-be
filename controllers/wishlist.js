const ProductModel = require('../models/product');

// Add to wishlist
exports.addToWishlist = (req, res, next) => {
    const user = req.user;

    user.wishlistproducts.push({
        _prodid: req.body.prodid
    });

    user.save().then((user) => {
        res.send(user.wishlistproducts);
    }).catch((err) => {
        res.status(400).send(err);
    });

};

// Remove from wishlist
exports.removeFromWishlist = (req, res, next) => {
    const prodid = req.body.prodid;

    req.user.update({
        '$pull': {
            'wishlistproducts': {
                '_prodid': prodid
            }
        }
    }).then(() => {
        res.status(200).send();
    }).catch(() => {
        res.status(400).send();
    });

};

// Get wishlist
exports.getWishlist = (req, res, next) => {

    const tempWishlist = [];

    req.user.wishlistproducts.forEach((wishlistproduct) => {
        tempWishlist.push(wishlistproduct['_prodid']);
        
    });

    ProductModel.find({
        _id: {
            $in: tempWishlist
        }
    }).then((products) => {
        const productsLength = products.length;

        let responseArray = [];

        for(let i = 0; i < productsLength; i++)
        {
            responseArray.push({
                epoch: req.user.wishlistproducts[i].epoch,
                product: products[i]
            });
        }

        res.send(responseArray);

    }).catch((err) => {
        res.status(400).send(err);
    });

};