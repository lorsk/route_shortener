"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { Logger } from '../utils/logger.util';
const model_1 = __importDefault(require("./model"));
class Service {
    constructor() {
        // private logger: Logger = new Logger('shortUrl-service');
        this.generateShortUrl = async (link) => {
            let shortUrl;
            if (this.isEmpty(link)) {
                return { status: 400, json: { msg: 'Invalid Request', data: {} } };
            }
            // Create a shorturl object
            shortUrl = new model_1.default({
                url: link,
            });
            const response = await this.createAndSaveShortUrl(shortUrl);
            return response;
        };
        this.createAndSaveShortUrl = async (shortUlrObj) => {
            // Generate a random string to replace the url
            let randomStr = this.generateRandomString();
            // Check if the random string already exist in DB 
            let result = await model_1.default.findOne({ urlCode: randomStr });
            while (!this.isEmpty(result)) {
                randomStr = this.generateRandomString();
                result = await model_1.default.findOne({ urlCode: randomStr });
            }
            shortUlrObj.urlCode = randomStr;
            // Not a duplicate
            shortUlrObj.save(err => {
                if (err) {
                    return { status: 400, json: { success: false, msg: err, data: shortUlrObj } };
                }
            });
            return { status: 200, json: { success: true, data: `/${randomStr}` } };
        };
        this.generateRandomString = () => {
            const length = 6;
            const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let retVal = '';
            for (let i = 0, n = charset.length; i < length; i = i + 1) {
                retVal += charset.charAt(Math.floor(Math.random() * n));
            }
            return retVal;
        };
        this.isEmpty = (obj) => {
            if (obj == null)
                return true;
            return Object.entries(obj).length === 0 && obj.constructor === Object;
        };
    }
}
exports.Service = Service;
