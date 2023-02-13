const app =require("./app");
const dotenv = require("dotenv");

dotenv.config({ path: "backend/config/config.env" });

// always implement config functions after dotenv.config
const PORT = process.env.PORT;
const connectDatabase = require("./config/database");

// initialising server
app.listen(PORT, () => {
  console.log(`Listening to ${PORT}...`)
})

// connecting to database
connectDatabase();