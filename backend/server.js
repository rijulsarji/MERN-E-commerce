const app =require("./app");
const dotenv = require("dotenv");

dotenv.config({ path: "backend/config/config.env" });

// always implement config functions after dotenv.config
const PORT = process.env.PORT;
const connectDatabase = require("./config/database");

// if we type console.log(youtube), it will give error "youtube is not defined". these types of errors are called uncaught exceptions. and we will handle those errors below.
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Error due to uncaught exception");

  process.exit(1);
})

// initialising server
const server = app.listen(PORT, () => {
  console.log(`Listening to ${PORT}...`)
})

// connecting to database
connectDatabase();

// unhandled promise rejection: if mongo string is invalid, we will be shutting down the server without proceed further.

process.on("unhandledRejection", err => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down server due to unhandled promise rejection")
  
  server.close(() => {
    process.exit(1);
  });
})