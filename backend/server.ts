import express, {Application, Request, Response} from "express";
import * as mongoose from "mongoose";
import cors from "cors";
import Stripe from "stripe";
import axios from "axios";
import dotenv from "dotenv";


const app: Application = express();
const port = process.env.PORT || 5001;
console.log(`Port: ${port}`);



// Middleware

app.use(
  cors({
    origin: "*", // Allow requests from any origin
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000" })); // Allow React app

dotenv.config({ path: "../.env" });

console.log("Environment Variables:");
console.log("MONGO_URI:", process.env.MONGO_URI);

console.log("GOOGLE_API_KEY:", process.env.GOOGLE_API_KEY);
//app.use(cors({ origin: "http://localhost:3005" })); // Allow React app
console.log('STRIPE_PUBLIC_KEY', process.env.STRIPE_PUBLIC_KEY);
console.log('STRIPE_SECRET_KEY', process.env.STRIPE_SECRET_KEY);



// MongoDB Connection
const mongoUri = process.env.MONGO_URI || "";
console.log(`Mongo URI: ${mongoUri}`);
mongoose
  .connect(mongoUri, { dbName: "Topic2" })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(`MongoDB connection error: ${err}`));

// Stripe Payment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
// Route to create a payment intent
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent", error);
    res.status(500).send({ error: error });
  }
});

// Route to fetch events using Google API
app.get("/api/events", async (req: Request, res: Response) => {
  const { zipcode } = req.query;

  if (!zipcode) {
    res.status(400).send({ error: "Zipcode is required" });
    return;
  }

  try {
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    const radius = 100 * 1609.34; // 100 miles in meters

    // Fetch latitude and longitude for the zipcode
    const geocodeResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address: zipcode,
          key: GOOGLE_API_KEY,
        },
      }
    );

    const location = geocodeResponse.data.results[0]?.geometry.location;
    if (!location) {
      res.status(404).send({ error: "Invalid zipcode" });
      return;
    }

    const { lat, lng } = location;

    // Fetch nearby events or places
    const placesResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: `${lat},${lng}`,
          radius,
          keyword: "tech events",
          key: GOOGLE_API_KEY,
        },
      }
    );

    res.send(placesResponse.data);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).send({ error: "Unable to fetch events. Please try again later." });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


//.//////////////////////////////////////////////////////////////////////////////////////////////////
//Person 5: Toufiq Hossian
//
//Frontend (to integrate in REACT): 
// Event Schema
const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  time: String,
  location: {
    type: String,
    coordinates: [Number], // For Google Maps integration
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isLocal: { type: Boolean, default: true },
  image: String, // Store Cloudinary URL
});

// RSVP Schema
const RsvpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  rsvpStatus: { type: String, enum: ['attending', 'interested', 'declined'] },
});

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  savedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  rsvpHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rsvp' }],
});


//Local Events :
const createLocalEvent = async (eventData) => {
  const event = new Event(eventData);
  return await event.save();
};
//Retrieve User-saved Events :
const getUserSavedEvents = async (userId) => {
  return await User.findById(userId).populate('savedEvents');
};
//Save RSVP Data : 
const createRSVP = async (userId, eventId, status) => {
  const rsvp = new Rsvp({ userId, eventId, rsvpStatus: status });
  return await rsvp.save();
};
//Delete Event : 
const deleteEvent = async (eventId) => {
  return await Event.findByIdAndDelete(eventId);
};

//.////////////////////////////////////////////////////////////////////////////////////////////////
//Backend (to integrate in Node.js):
//Endpoint to Fetch Events : 

app.get('/api/events', async (req, res) => {
try {
  const events = await Event.find();
  res.json(events);
} catch (err) {
  res.status(500).json({ error: 'Failed to fetch events' });
}
});

//Endpoint for RSVPs:

app.post('/api/rsvp', async (req, res) => {
  const { userId, eventId, status } = req.body;
  try {
    const rsvp = await createRSVP(userId, eventId, status);
    res.status(201).json(rsvp);
  } catch (err) {
    res.status(500).json({ error: 'Failed to RSVP' });
  }
});
