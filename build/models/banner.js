"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Banner = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Define mongoose schema
const bannerSchema = new mongoose_1.default.Schema({
    number: {
        type: Number,
        required: true
    },
    poll: {
        type: String,
        required: false
    },
    edition: {
        type: Number,
        required: true
    },
    enabled: {
        type: Boolean,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    bannerName: {
        type: String,
        required: true
    },
    era: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    sponsor: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    long: {
        type: Number,
        required: true
    }
});
// Create static method to create instance of model that uses typescript type checking
bannerSchema.statics.build = (attr) => {
    return new Banner(attr);
};
// Build model from mongoose schema
const Banner = mongoose_1.default.model('Banner', bannerSchema);
exports.Banner = Banner;
