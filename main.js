const express = require("express");
const path = require("path");
const connectDB = require("./db")

/*--------------------+
 | Modèles de données |
 +--------------------*/

const Users = require("./models/USER");
const Restaurants = require("./models/RESTAURANT");
const Menus = require("./models/MENUS");

/*----------+
 | Routeurs |
 +----------*/

const userRouter = require("./routes/users.js");
const restaurantRouter = require("./routes/restaurant.js");
const menuRouter = require("./routes/menus.js");


// Ajouter la connection à la DB plus tard

const app = express();

app.use(express.json());
app.use("./middleware/auth.js");


app.use("/users",userRouter);
app.use("/restaurant",restaurantRouter);
app.use("/menu",menuRouter);

app.get("/",(req,res) => {
  return res.status(200).json({message:"It's running :D"});
});