"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose = __importStar(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5001;
console.log(`Port: ${port}`);
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({ origin: "http://localhost:3000" })); // Allow React app
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "../.env" });
console.log("Environment Variables:");
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("GOOGLE_API_KEY:", process.env.GOOGLE_API_KEY);
// MongoDB Connection
const mongoUri = process.env.MONGO_URI || "";
console.log(`Mongo URI: ${mongoUri}`);
mongoose
    .connect(mongoUri, { dbName: "Topic2" })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(`MongoDB connection error: ${err}`));
// // Stripe Payment
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
// // Route to create a payment intent
// app.post("/create-payment-intent", async (req, res) => {
//   try {
//     const { amount } = req.body;
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount,
//       currency: "usd",
//     });
//     res.send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.error("Error creating payment intent", error);
//     res.status(500).send({ error: error });
//   }
// });
// Route to fetch events using Google API
app.get("/api/events", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { zipcode } = req.query;
    if (!zipcode) {
        res.status(400).send({ error: "Zipcode is required" });
        return;
    }
    try {
        const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
        const radius = 100 * 1609.34; // 100 miles in meters
        // Fetch latitude and longitude for the zipcode
        const geocodeResponse = yield axios_1.default.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
            params: {
                address: zipcode,
                key: GOOGLE_API_KEY,
            },
        });
        const location = (_a = geocodeResponse.data.results[0]) === null || _a === void 0 ? void 0 : _a.geometry.location;
        if (!location) {
            res.status(404).send({ error: "Invalid zipcode" });
            return;
        }
        const { lat, lng } = location;
        // Fetch nearby events or places
        const placesResponse = yield axios_1.default.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
            params: {
                location: `${lat},${lng}`,
                radius,
                keyword: "tech events",
                key: GOOGLE_API_KEY,
            },
        });
        res.send(placesResponse.data);
    }
    catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).send({ error: "Unable to fetch events. Please try again later." });
    }
}));
// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
