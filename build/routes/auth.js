"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_random_string_1 = __importDefault(require("crypto-random-string"));
const moment_1 = __importDefault(require("moment"));
// Import models
const user_1 = require("../models/user");
const token_1 = require("../models/token");
// Import settings
const settings_1 = __importDefault(require("../config/settings"));
// Define functions 
/**
 * Generate token from provided lifespan and username
 * @param username username of user to create token for
 * @param lifespan lifespan of token
 * @returns token object
 */
const generateToken = (username, lifespan) => {
    const tokenString = crypto_random_string_1.default({ length: settings_1.default.TOKEN_LENGTH, type: 'alphanumeric' });
    const tokenExpiry = moment_1.default().add(lifespan, 'm');
    return {
        token: tokenString,
        username: username,
        expiry: tokenExpiry.toDate()
    };
};
// Create router for export
const router = express_1.default.Router();
exports.authRouter = router;
// Define routes
router.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (username === undefined || password === undefined) {
        res.status(400).send("Body of request must contain username and password");
    }
    else {
        user_1.User.findOne({ username: username })
            .then(doc => {
            // check if user exists in database
            if (doc === null) {
                return Promise.reject({ code: 400, message: "Failed to authenticate user" });
            }
            else {
                // User exists
                return Promise.resolve(doc);
            }
        })
            .then(user => {
            // compare password with known hash
            return bcrypt_1.default.compare(password, user.password);
        })
            .then(result => {
            // If password doesnt match
            if (!result) {
                return Promise.reject({ code: 400, message: "Failed to authenticate user" });
            }
        })
            .then(() => {
            // Passwords match, generate token
            return token_1.Token.findOneAndUpdate({ username: username }, generateToken(username, settings_1.default.TOKEN_LIFESPAN_IN_MINUTES), { upsert: true, new: true });
        })
            .then(token => { res.status(200).send(token); }) // return the new token
            .catch(error => {
            res.status(error.code ? error.code : 500).send(error.message ? error.message : "Failed to create new user");
        });
    }
});
// Handle logging out
router.post('/auth/logout', (req, res) => {
    const { token } = req.body; // get token from the body
    if (token === undefined) { // ensure a token was provided
        res.status(400).send("Body of request must contain token");
    }
    else { // token provided
        token_1.Token.findOne({ token: token })
            .then(doc => {
            if (doc === null) { // token provided does not exist
                return Promise.reject({ code: 400, message: "Unable to invalidate token (token invalid)" });
            }
            else { // token provided exists (expired or valid)
                doc.delete();
                res.status(200).send("Provided token is no longer valid");
            }
        })
            .catch(error => {
            res.status(error.code ? error.code : 500).send(error.message ? error.message : "Failed to create new user");
        });
    }
});
// handle creating users
router.post('/auth/create', (req, res) => {
    const { username, password } = req.body; // get username and password from the request
    if (username === undefined || password === undefined) { // ensure username and password was provided
        res.status(400).send("Body of request must contain username and password");
    }
    else { // username and password provided
        user_1.User.findOne({ username: username })
            .then(doc => {
            if (doc !== null) {
                return Promise.reject({ code: 400, message: `User already exists with username ${username}` });
            }
        })
            .then(() => {
            // Generate a salt
            return bcrypt_1.default.genSalt(settings_1.default.SALT_ROUNDS);
        })
            .then(salt => {
            // Hash the password using the generated salt
            return Promise.all([bcrypt_1.default.hash(password, salt), salt]);
        })
            .then(([hash, salt]) => {
            // Create a user with the generated hash and salt
            const user = user_1.User.build({ username: username, password: hash, salt: salt, permissions: [] });
            return user.save();
        })
            .then(() => {
            // Generate a token for the new user
            const token = token_1.Token.build(generateToken(username, settings_1.default.TOKEN_LIFESPAN_IN_MINUTES));
            return token.save();
        })
            .then((token) => {
            // Return the token for the new user
            res.status(201).send(token);
        })
            .catch(error => {
            // Handle and return any errors
            res.status(error.code ? error.code : 500).send(error.message ? error.message : "Failed to create new user");
        });
    }
});
