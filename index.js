import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import url_route from "./routes/url_route.js";

const app = express();
const { MONGO_URI, PORT } = process.env;

app.use(express.json());
app.use(morgan("common"));
// app.options("*", cors()); // Handle preflight requests for all routes
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "https://client-url-shortner-two.vercel.app",
//     ], // Allow requests from these origins
//     methods: ["GET", "POST", "OPTIONS"], // Allow GET, POST, and OPTIONS (for preflight)
//     allowedHeaders: ["Content-Type"], // Allow only specific headers
//     credentials: true, // Allow credentials (if needed)
//   })
// );

// const allowedOrigins = [
//   "http://localhost:3000",
//   "https://client-url-shortner-two.vercel.app",
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin (e.g., mobile apps, curl requests)
//       if (!origin) return callback(null, true);

//       // Check if the origin is in the allowed list
//       if (allowedOrigins.indexOf(origin) === -1) {
//         const msg = `The CORS policy for this site does not allow access from the specified origin: ${origin}.`;
//         return callback(new Error(msg), false);
//       }

//       // Allow the request
//       return callback(null, true);
//     },
//     methods: ["GET", "POST", "OPTIONS"], // Allow only GET, POST, and OPTIONS
//     allowedHeaders: ["Content-Type"], // Allow only specific headers
//     credentials: true, // Allow credentials (if needed)
//   })
// );

app.use(cors({ origin: "http://192.168.100.4:3000" }));

// app.use(cors());
app.use("/url", url_route);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(` ========== db conn ========== `);
  })
  .catch((error) => {
    console.log(` ========== db fail ========== \n+${error}`);
  });

app.get("/", (req, res) => {
  res.json({ Greeting: "Welcome to server" });
});

app.listen(PORT, () => {
  console.log(`Server is runnig at ${PORT}`);
});
