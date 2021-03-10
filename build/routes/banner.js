"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bannerRouter = void 0;
const express_1 = __importDefault(require("express"));
// Import middleware
const authentication_1 = require("../middleware/authentication");
// Import models
const banner_1 = require("../models/banner");
// Import enumerations
const permissions_1 = __importDefault(require("../enumerations/permissions"));
// Create router for export
const router = express_1.default.Router();
exports.bannerRouter = router;
// Define routes
router.get('/api/banner/all', authentication_1.needsRole(), (req, res) => {
    banner_1.Banner.find({})
        .then((docs) => {
        res.status(200).send(docs);
    });
});
router.post('/api/banner', authentication_1.needsRole([permissions_1.default.MANAGE_BANNERS]), (req, res) => {
    const banner = banner_1.Banner.build(req.body);
    banner.save()
        .then(() => {
        res.status(201).send(banner);
    })
        .catch(error => {
        const errorType = error.name;
        switch (errorType) {
            case "ValidationError":
                res.status(400).send(error.message);
                break;
            default:
                res.status(500).send("An error has occured");
                break;
        }
    });
});
