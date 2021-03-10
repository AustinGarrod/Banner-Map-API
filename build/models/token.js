"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Define mongoose schema
const tokenSchema = new mongoose_1.default.Schema({
    token: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    expiry: {
        type: Date,
        required: true
    }
});
// Create static method to create instance of model that uses typescript type checking
tokenSchema.statics.build = (attr) => {
    return new Token(attr);
};
// Build model from mongoose schema
const Token = mongoose_1.default.model('Token', tokenSchema);
exports.Token = Token;
