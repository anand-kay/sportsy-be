const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String, 
        required: true, 
        unique: true
    },
    password: {
        type: String, 
        required: true
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],
    name: {
        type: String,
        required: true
    },
    cartitems: [{
        _prodid: {
            type: String,
            required: true
        },
        epoch: {
            type: Number,
            required:true,
            default: Date.now
        },
        quantity: {
            type: Number,
            required:true,
            default: 1
        }
    }],
    houseno: {
        type: String
    },
    street: {
        type: String
    },
    city: {
        type: String
    },
    pincode: {
        type: Number
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    wishlistproducts: [{
        _prodid: {
            type: String,
            required: true
        },
        epoch: {
            type: Number,
            required:true,
            default: Date.now
        }
    }],
    purchases: [{
        _prodid: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        epoch: {
            type: Number,
            required:true,
            default: Date.now
        },
        quantity: {
            type: Number,
            required: true
        }
    }]
});

// Hash password and then save to database for signup and (maybe) password change in future
UserSchema.pre('save', function(next) {
    const user = this;
    
    if(user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    }
    else {
        next();
    }

});

// Generate new JWT for login and signup
UserSchema.methods.generateAuthToken = function() {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({
        _id: user._id.toHexString(),
        access
    },
    '123abc'
    ).toString();

    user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
    });

};

// Find user by email for login
UserSchema.statics.findByCredentials = function(email, password) {
    const User = this;

    return User.findOne({email}).then((user) => {
        if(!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(res) {
                    resolve(user);
                }
                else {
                    reject(err);
                }
            });
        });
    });

};

// Find user by token(JWT)
UserSchema.statics.findByToken = function(token) {
    const User = this;

    let decoded;

    try {
        decoded = jwt.verify(token, '123abc');
    }
    catch(err) {
        return Promise.reject();
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });

};

// Delete existing token(JWT) for logout
UserSchema.methods.removeToken = function(token) {
    const user = this;

    return user.update({
        $pull: {
            tokens: { token }
        }
    });

};

// Add product to cart
UserSchema.methods.addToCart = function(prodid, quantity) {
    const user = this;

    user.cartitems.push({
        _prodid: prodid,
        quantity: quantity
    });

    return user.save().then(() => {
        return true;
    });

}

module.exports = mongoose.model('User', UserSchema);