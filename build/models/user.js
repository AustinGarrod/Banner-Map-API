"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Define mongoose schema
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    permissions: {
        type: [String],
        required: true
    }
});
// Create static method to create instance of model that uses typescript type checking
userSchema.statics.build = (attr) => {
    return new User(attr);
};
// Build model from mongoose schema
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
