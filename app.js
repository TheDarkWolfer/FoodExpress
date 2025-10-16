const express = require("express");
const path = require("path");
const connectDB = require("./db");

const app = express();

/*-------------+
 | Middlewares |
 +-------------*/
app.use(express.json());

/*--------------------+
 | Modèles de données |
 +--------------------*/

const Users = require("./models/USER");
const Restaurants = require("./models/Restaurants.js");
const Menus = require("./models/MENUS");

/*----------+
 | Routeurs |
 +----------*/

try {
  const userRouter = require("./routes/users.js");
  app.use("/users",userRouter);
  console.log(`User router loaded successfully !`)
} catch(error) {
  console.log(`Error when loading user router !\n-------\n${error}`)
}

try {
  const restaurantRouter = require("./routes/restaurantRoutes.js");
  app.use("/restaurant",restaurantRouter);
  console.log(`Restaurant router loaded successfully !`)
} catch(error) {
  console.log(`Error when loading restaurant router !\n-------\n${error}`)
}
/*
try {
  const menuRouter = require("./routes/menusRoutes.js");
  app.use("/menu",menuRouter);
  console.log(`Menu router loaded successfully !`)
} catch(error) {
  console.log(`Error when loading menu router !\n-------\n${error}`)
}
*/

// Ajouter la connection à la DB plus tard
try {
  connectDB();
} catch(error) {
  console.error(`/!\\ `)
}

//app.use("./middleware/auth.js");

if (process.env.NODE_ENV === "development") {
  console.log("╭─────────────────╮\n│ DEV ENVIRONMENT │\n╰─────────────────╯")
} else {
  console.log("╭──────────────────╮\n│ PROD ENVIRONMENT │\n╰──────────────────╯")
}

app.get("/",(req,res) => {
  return res.status(200).json({message:"It's running :D"});
});

module.exports = app;