// models/Order.js

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:      { type: String, required: true },
  image:     { type: String, required: true },
  price:     { type: Number, required: true },
  quantity:  { type: Number, required: true, min: 1 },
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone:    { type: String, required: true },
  street:   { type: String, required: true },
  city:     { type: String, required: true },
  state:    { type: String, required: true },
  zipCode:  { type: String, required: true },
  country:  { type: String, default: 'Pakistan' },
});

const orderSchema = new mongoose.Schema(
  {
    user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems:      [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod:   {
      type: String,
      enum: ['cod', 'card', 'easypaisa', 'jazzcash'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'processing',
    },
    itemsPrice:    { type: Number, required: true },
    shippingPrice: { type: Number, default: 0 },
    taxPrice:      { type: Number, default: 0 },
    totalPrice:    { type: Number, required: true },
    paidAt:        { type: Date },
    deliveredAt:   { type: Date },
    trackingNumber:{ type: String, default: '' },
    notes:         { type: String, default: '' },
  },
  { timestamps: true }
);

// Generate order number
orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = 'ORD-' + Date.now().toString().slice(-8);
  }
  next();
});

orderSchema.add({ orderNumber: { type: String, unique: true, sparse: true } });

module.exports = mongoose.model('Order', orderSchema);
