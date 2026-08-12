const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    category: {
      type: String,
      required: true,
      enum: ["single-bucket", "double-bucket", "pipeline", "spare-parts", "dairy-essentials", "other"],
    },
    brand: { type: String, default: "Al Rehman" },
    specifications: {
      capacity: { type: String },
      motorPower: { type: String },
      material: { type: String },
      weight: { type: String },
      warranty: { type: String },
    },
    images: [{ type: String, required: true }],
    stock: { type: Number, required: true, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
