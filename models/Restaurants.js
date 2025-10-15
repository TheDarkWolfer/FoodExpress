// models/restaurantModels.js
import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String },
  phone: { type: Number, required: true },
  opening_hours: { type: String, required: true },
});

export default mongoose.model("Menu", menuSchema);
