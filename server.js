import path from "path";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import logger from "morgan";
import https from "https";
import fs from "fs";
import connectDB from "./config/db.js";
import { fileFilter, fileStorage } from "./multer";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes";
import SubscriptionRoutes from "./routes/subscriptionRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import wishListRoutes from "./routes/wishListRoutes";
import documentRoutes from "./routes/documentRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import taxRoutes from "./routes/taxRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import consultationRoutes from "./routes/consultationRoutes";
import shipmentRoutes from "./routes/shipmentRoutes";
import instructionRoutes from "./routes/instructionRoutes";
import promoCodeRoutes from "./routes/promoCodeRoutes";
import faqsRoutes from "./routes/faqsRoutes";
import eventRoutes from "./routes/eventRoutes";

import { v4 as uuidv4 } from "uuid";

import Stripe from "stripe";
const stripe = Stripe("sk_test_OVw01bpmRN2wBK2ggwaPwC5500SKtEYy9V");

dotenv.config();
const PORT = 5089;

// SSL Configuration
const local = false;
let credentials = {};

if (local) {
  credentials = {
    key: fs.readFileSync("/etc/apache2/ssl/onlinetestingserver.key", "utf8"),
    cert: fs.readFileSync("/etc/apache2/ssl/onlinetestingserver.crt", "utf8"),
    ca: fs.readFileSync("/etc/apache2/ssl/onlinetestingserver.ca")
  };
} else {
  credentials = {
    key: fs.readFileSync("../certs/ssl.key"),
    cert: fs.readFileSync("../certs/ssl.crt"),
    ca: fs.readFileSync("../certs/ca-bundle")
  };
}

connectDB();
const app = express();
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(logger("dev"));

app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter
  }).fields([
    {
      name: "user_image",
      maxCount: 1
    },
    {
      name: "ad_video",
      maxCount: 1
    },
    {
      name: "doc_schedule",
      maxCount: 1
    },
    {
      name: "reciepts",
      maxCount: 12
    },
    {
      name: "video_file",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ])
);

app.post("/api/checkout", async (req, res) => {
  console.log("Request:", req.body);

  let error;
  let status;
  try {
    const { product, token } = req.body;
    console.log(product, typeof product, "prodprice");
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    });

    const idempotency_key = uuidv4();
    const charge = await stripe.charges.create(
      {
        amount: product * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        // description: `Purchased the ${product.name}`,
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip
          }
        }
      },
      {
        idempotency_key
      }
    );
    console.log("Charge:", { charge });
    res.json(charge);

    status = "success";
  } catch (error) {
    console.error("Error:", error);
    status = "failure";
    res.json(error);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/subscription", SubscriptionRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/wishList", wishListRoutes);
app.use("/api/document", documentRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/tax", taxRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/consultationRoutes", consultationRoutes);
app.use("/api/shipment", shipmentRoutes);
app.use("/api/instruction", instructionRoutes);
app.use("/api/promo", promoCodeRoutes);
app.use("/api/faq", faqsRoutes);
app.use("/api/event", eventRoutes);

const __dirname = path.resolve();
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/api/download/uploads/:file_name", function (req, res) {
  console.log("IN HERE", req.params);
  const file = `${__dirname}/uploads/${req.params.file_name}`;
  res.download(file); // Set disposition and send it.
});
app.get("/", (req, res) => {
  res.send("API is running....");
});

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT, () => {
  console.log(
    "\u001b[" + 34 + "m" + `Server started on port: ${PORT}` + "\u001b[0m"
  );
});
