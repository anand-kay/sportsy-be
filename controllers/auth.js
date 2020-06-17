const UserModel = require('../models/user');

// Signup
exports.signupUser = (req, res, next) => {
    const user = new UserModel({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name
    });

    console.log(user);

    user.save().then((user) => {

        console.log(user);

        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send({token});
    }).catch((err) => {
        res.status(400).send(err);
    });

};

// Login
exports.loginUser = (req, res, next) => {
    UserModel.findByCredentials(req.body.email, req.body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send({token});
        });
    }).catch((err) => {
        res.status(400).send();
    });

};

// Logout
exports.logoutUser = (req, res, next) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });

};
