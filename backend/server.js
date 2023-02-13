const app =require("./app");
const dotenv = require("dotenv");

dotenv.config({ path: "backend/config/config.env" })

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Listening to ${PORT}...`)
})