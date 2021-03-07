import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import cryptoRandomString from 'crypto-random-string';
import moment from 'moment';

// Import models
import { User } from '../models/user';
import { Token } from '../models/token';

// Import interfaces
import IToken from '../interfaces/token';

// Import settings
import SETTINGS from '../config/settings';

// Define functions 

/**
 * Generate token from provided lifespan and username
 * @param username username of user to create token for
 * @param lifespan lifespan of token
 * @returns token object
 */
const generateToken = (username: string, lifespan: number): IToken => {
  const tokenString = cryptoRandomString({length: SETTINGS.TOKEN_LENGTH, type: 'alphanumeric'});
  const tokenExpiry = moment().add(lifespan, 'm');

  return {
    token: tokenString,
    username: username,
    expiry: tokenExpiry.toDate()
  }
}

// Create router for export
const router = express.Router();

// Define routes
router.post('/auth/login', (req: Request, res: Response) => {
  const {username, password} = req.body;

  if (username === undefined || password === undefined) {
    res.status(400).send("Body of request must contain username and password");
  } else {
    User.findOne({username: username})
    .then(doc => {
      // check if user exists in database
      if (doc === null) {
        return Promise.reject({code: 400, message: "Failed to authenticate user"});
      } else {
        // User exists
        return Promise.resolve(doc);
      }
    })
    .then(user => {
      // compare password with known hash
      return bcrypt.compare(password, user.password);
    })
    .then(result => {
      // If password doesnt match
      if (!result) {
        return Promise.reject({code: 400, message: "Failed to authenticate user"});
      } 
    })
    .then(() => {
      // Passwords match, generate token
      return Token.findOneAndUpdate(
        {username: username}, 
        generateToken(username, SETTINGS.TOKEN_LIFESPAN_IN_MINUTES), 
        {upsert: true, new: true})
    })
    .then(token => { res.status(200).send(token) }) // return the new token
    .catch(error => { // catch and return any errors
      res.status(error.code ? error.code : 500).send(error.message ? error.message : "Failed to create new user");
    });

  }

});

// Handle logging out
router.post('/auth/logout', (req: Request, res: Response) => {
  const {token} = req.body; // get token from the body

  if (token === undefined) { // ensure a token was provided
    res.status(400).send("Body of request must contain token");
  } else { // token provided
    Token.findOne({token: token})
      .then(doc => {
        if (doc === null) { // token provided does not exist
          return Promise.reject({code: 400, message: "Unable to invalidate token (token invalid)"});
        } else { // token provided exists (expired or valid)
          doc.delete();
          res.status(200).send("Provided token is no longer valid");
        }
      })
      .catch(error => { // catch and return any errors
        res.status(error.code ? error.code : 500).send(error.message ? error.message : "Failed to create new user");
      });
  }
});

// handle creating users
router.post('/auth/create', (req: Request, res: Response) => {
  const {username, password} = req.body; // get username and password from the request

  if (username === undefined || password === undefined) { // ensure username and password was provided
    res.status(400).send("Body of request must contain username and password");
  } else { // username and password provided
    User.findOne({username: username})
    .then(doc => { // Check if username already exists
      if (doc !== null) {
        return Promise.reject({code: 400, message: `User already exists with username ${username}`})
      }
    })
    .then(() => {
      // Generate a salt
      return bcrypt.genSalt(SETTINGS.SALT_ROUNDS);
    })
    .then(salt => {
      // Hash the password using the generated salt
      return Promise.all([bcrypt.hash(password, salt), salt]);
    })
    .then(([hash, salt]) => {
      // Create a user with the generated hash and salt
      const user = User.build({username: username, password: hash, salt: salt, permissions: []})
      
      return user.save();
    })
    .then(() => {
      // Generate a token for the new user
      const token = Token.build(generateToken(username, SETTINGS.TOKEN_LIFESPAN_IN_MINUTES));

      return token.save()
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

// Export route with unique name
export { router as authRouter }