const ProductModel = require('../models/product');
const RecentModel = require('../models/recent');
const ObjectId = require('mongodb').ObjectID;

// Add new product to the database
exports.newProduct = (req, res, next) => {
    const product = new ProductModel({
        title: req.body.title,
        price: req.body.price,
        discount: req.body.discount,
        description: req.body.description,
        quantityleft: req.body.quantityleft,
        image: req.body.image,
        seller: req.body.seller,
        category: req.body.category,
        subcategory: req.body.subcategory
    });

    product.save().then((product) => {
        res.send(product);
    }).catch((err) => {
        res.status(400).send(err);
    });

};

// Add a review for a product
exports.newReview = (req, response, next) => {
    ProductModel.findOneAndUpdate({
        _id: new ObjectId(req.query.id)
    }, {
            $push: {
                reviews: {
                    _userid: req.user._id,
                    star: req.body.star,
                    review: req.body.review
                }
            }
        }).then((product) => {

            // console.log(product);

            let sumRatings = 0;

            product.reviews.forEach((review) => {
                sumRatings += review.star;
            });

            let avgRating = (sumRatings + req.body.star) / (product.reviews.length + 1);

            product.rating = avgRating;

            product.save().then(() => {

                response.send();

            });

        }).catch((err) => {
            response.status(400).send(err);
        });

};

// Get products by category
exports.getByCategory = (req, res, next) => {
    const page = +req.query.page || 1;

    ProductModel.find({
        category: req.query.cat
    }).then((products) => {
        res.send({
            count: products.length,
            products: products.slice(((page - 1) * 20), (page * 20))
        });

    }).catch((err) => {
        res.status(400).send(err);
    });

};

// Get products by sub-category
exports.getBySubcategory = (req, res, next) => {
    const page = +req.query.page || 1;

    ProductModel.find({
        subcategory: req.query.subcat
    }).then((products) => {
        res.send({
            count: products.length,
            products: products.slice(((page - 1) * 20), (page * 20))
        });

    }).catch((err) => {
        res.status(400).send(err);
    });

};

// Get products by search
exports.getBySearch = (req, res, next) => {
    const page = +req.query.page || 1;

    ProductModel.find({
        title: {
            $regex: req.query.q,
            $options: 'i'
        }
    }).then((products) => {
        res.send({
            count: products.length,
            products: products.slice(((page - 1) * 20), (page * 20))
        });

    }).catch((err) => {
        res.status(400).send(err);
    });

};

// Get recently viewed products (Responds with recents if more than 4 recents exist, or random badminton products otherwise)
exports.getByRecent = (req, res, next) => {
    fetchRecentProducts(req).then((products) => {

        if (products.length > 4) {

            res.send({
                isRecents: true,
                products: products
            });

        }
        else {

            fetchCategoryProducts('Badminton').then((products) => {
                res.send({
                    isRecents: false,
                    products: products
                });

            }).catch((err) => {
                res.status(400).send(err);
            });

        }

    }).catch((err) => {
        res.status(400).send(err);
    });

};

// Get recommended products
exports.getByRecommended = (req, res, next) => {
    fetchRecentProducts(req).then((products) => {
        let categories = [];

        products.forEach((product) => {
            categories.push(product.category);
        });

        ProductModel.find({
            category: {
                $in: categories
            }
        }).countDocuments().then((numProducts) => {
            if (numProducts == 0) {
                fetchCategoryProducts('Cricket').then((products) => {
                    res.send(products);
    
                }).catch((err) => {
                    res.status(400).send(err);
                });

            }
            else {
                var random = Math.floor(Math.random() * (numProducts - 10));

                ProductModel.find({
                    category: {
                        $in: categories
                    }
                }).skip(random).limit(10).then((products) => {
                    res.send(products);

                }).catch((err) => {
                    res.status(400).send(err);
                });

            }

        });

    }).catch((err) => {
        res.status(400).send(err);
    });

};

// Get featured products
exports.getByFeatured = (req, res, next) => {
    const featuedIds = [
        "5d11281a82dcec00041ef195",
        "5d136c3a8eebb500047b70bb",
        "5d1373a98eebb500047b70d8",
        "5d1383b7147bec0004c5f6e2",
        "5d138499147bec0004c5f6e4",
        "5d138798147bec0004c5f6ed",
        "5d136d308eebb500047b70c3",
        "5d1373508eebb500047b70d6",
        "5d1379698eebb500047b70ea",
        "5d1373778eebb500047b70d7"
    ];

    ProductModel.find({
        _id: {
            $in: featuedIds
        }
    }).then((products) => {
        res.send(products);

    }).catch((err) => {
        res.status(400).send(err);

    });

};

// Get one product
exports.getProduct = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    ProductModel.findById(req.params.prodid).then((product) => {
        RecentModel.findOne({
            ip: ip
        }).then((doc) => {
            if (!doc) {
                // IP not found in database
                const recent = new RecentModel({
                    ip: ip
                });

                recent.prodids.push({
                    prodid: product.id
                });

                recent.save().then((recent) => {
                    console.log(recent);
                }).catch((err) => {
                    console.log(err);
                });

            }
            else {
                // IP found in database
                doc.prodids.push({
                    prodid: product.id
                });

                doc.save().then((doc) => {
                    console.log(doc);
                }).catch((err) => {
                    console.log(err);
                });

            }

        }).catch((err) => {
            console.log(err);
        });

        res.send(product);

    }).catch((err) => {
        res.status(400).send();
    });

};

const fetchRecentProducts = (req) => new Promise((resolve, reject) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    RecentModel.findOne({
        ip: ip
    }).then((doc) => {
        if (!doc) {
            // IP not found in database

            resolve([]);

        }
        else {
            // IP found in database

            let temp = [];

            for (let i = 0; i < doc.prodids.length; i++) {
                temp[i] = doc.prodids[i].prodid;
            }

            temp = temp.reverse();

            let temp2 = [...new Set(temp)];    // Converts to unique array

            let temp3 = [];

            if (temp2.length > 10) {
                temp2 = temp2.reverse();

                temp3 = temp2.slice((temp2.length - 10)).reverse();
            }
            else {
                temp3 = temp2;
            }

            ProductModel.find({
                _id: {
                    $in: temp3
                }
            }).then((products) => {
                products.sort((a, b) => {
                    if (temp3.indexOf(a.id) < temp3.indexOf(b.id)) {
                        return -1;
                    }
                    else if (temp3.indexOf(a.id) > temp3.indexOf(b.id)) {
                        return 1;
                    }
                    else {
                        return 0;
                    }

                });

                resolve(products);

            }).catch((err) => {
                console.log(err);

                reject(err);

            });

        }

    }).catch((err) => {
        console.log(err);

        reject(err);

    });

});

const fetchCategoryProducts = (cat) => new Promise((resolve, reject) => {
    ProductModel.find({
        category: cat
    }).countDocuments().then((numProducts) => {
        var random = Math.floor(Math.random() * (numProducts - 10));

        ProductModel.find({
            category: cat
        }).skip(random).limit(10).then((products) => {
            resolve(products);

        });

    }).catch((err) => {
        resolve([]);

    });

});