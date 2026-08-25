import dotenv from "dotenv";
dotenv.config();

// Now dynamically import the rest after dotenv is configured
await import("./server.js");