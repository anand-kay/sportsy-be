// Set address
exports.setAddress = (req, res, next) => {
    if( req.body.houseno ) {
        req.user.houseno = req.body.houseno;
    }

    if( req.body.street ) {
        req.user.street = req.body.street;
    }

    if( req.body.city ) {
        req.user.city = req.body.city;
    }

    if( req.body.pincode ) {
        req.user.pincode = req.body.pincode;
    }

    if( req.body.state ) {
        req.user.state = req.body.state;
    }

    if( req.body.country ) {
        req.user.country = req.body.country;
    }

    req.user.save().then((user) => {
        res.status(200).send(user);
    }).catch((err) => {
        res.status(400).send();
    });

};

// Get address
exports.getAddress = (req, res,next) => {
    const address = {
        houseno: req.user.houseno,
        street: req.user.street,
        city: req.user.city,
        pincode: req.user.pincode,
        state: req.user.state,
        country: req.user.country
    };
    
    res.send(address);

}