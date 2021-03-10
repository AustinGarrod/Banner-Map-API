"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
// Implement env file
dotenv.config();
// Import routes
const banner_1 = require("./routes/banner");
const auth_1 = require("./routes/auth");
// Get needed values from ENV
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;
const APP_PORT = process.env.PORT ? process.env.PORT : process.env.APP_PORT;
// Create express app
const app = express_1.default();
// apply libraries to express app
app.use(helmet_1.default());
app.use(body_parser_1.json());
app.use(cors_1.default());
// app.use(morgan('combined'));
// apply routes to express app
app.use(banner_1.bannerRouter);
app.use(auth_1.authRouter);
// Connect to MongoDB with mongoose
mongoose_1.default.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, () => {
    console.log("Connected to database");
});
// Start listening for requests
app.listen(APP_PORT, () => {
    console.log(`Server is listening on port ${APP_PORT}`);
});
