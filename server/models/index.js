// models/index.js — Centralized Model Exports

const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');
const Cart = require('./Cart');
const Review = require('./Review');
const Order = require('./Order');

module.exports = {
  User,
  Product,
  Category,
  Cart,
  Review,
  Order,
};
