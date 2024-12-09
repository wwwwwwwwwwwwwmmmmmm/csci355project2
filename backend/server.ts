import express, {Application} from 'express';
import * as mongoose from "mongoose";

import cors from 'cors';
import Stripe from "stripe";

const app: Application = express();
const port = process.env.PORT || 5000;
console.log(`Port: ${port}`);

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({origin: 'http://localhost:3000'})); // Allow React app

// MongoDB Connection
const mongoUri = process.env.MONGO_URI || '';
console.log(`Mongo URI: ${mongoUri}`);
mongoose.connect(mongoUri, {dbName: "Topic2"})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(`MongoDB connection error: ${err}`));

// Stripe Payment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
// Route to create a payment intent
app.post('/create-payment-intent', async (req, res) => {
    try {
        const {amount} = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Error creating payment intent', error);
        res.status(500).send({error: error});
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

