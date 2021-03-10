"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.needsRole = void 0;
const moment_1 = __importDefault(require("moment"));
// Import models
const token_1 = require("../models/token");
const user_1 = require("../models/user");
// Import settings
const settings_1 = __importDefault(require("../config/settings"));
// Middleware function to handle access authorization
const needsRole = (roles) => {
    return function (req, res, next) {
        const authType = req.headers.authorization?.split(" ")[0]; // get auth type from request
        const authToken = req.headers.authorization?.split(" ")[1]; // get token from request
        if (authType !== "Bearer" || authToken === undefined) { // Check that auth type is correct and that token is present
            res.status(401).send("Access Denied");
        }
        else { // Token present in request
            token_1.Token.findOne({ token: authToken }) // Pull token from database
                .then(doc => {
                if (doc === null) { // If token isn't found, deny access
                    return Promise.reject({ code: 401, message: "Access Denied (invalid token)" });
                }
                else if (moment_1.default(doc.expiry).isBefore(moment_1.default())) { // Token exists, check if token has expired
                    doc.remove();
                    return Promise.reject({ code: 401, message: "Access Denied (expired token)" });
                }
                else { // If valid token is found, extend life of token
                    doc.expiry = moment_1.default().add(settings_1.default.TOKEN_LIFESPAN_IN_MINUTES, 'm').toDate();
                    return doc.save();
                }
            })
                .then(doc => user_1.User.findOne({ username: doc.username })) // Get user associated with token
                .then(user => {
                if (user === null)
                    return Promise.reject({ code: 500, message: "Failed to get user with token" }); // Catch failure to get token
                if (roles === undefined)
                    return Promise.resolve(); // If no roles have been provided, assume basic auth is needed to make request
                if (!roles.every(role => user.permissions.includes(role)))
                    return Promise.reject({ code: 403, message: "Access Denied" }); // See if user has all roles needed to make request
            })
                .then(() => { next(); }) // allow request to continue
                .catch(error => {
                res.status(error.code ? error.code : 500).send(error.message ? error.message : "Failed authenticate token");
            });
        }
    };
};
exports.needsRole = needsRole;
