const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  image: {
    type: String,
    default: ''
  }
});

const CartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  items: [CartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

CartSchema.virtual('total').get(function() {
  return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

CartSchema.methods.calculateTotals = function() {
  return {
    subtotal: this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    itemCount: this.items.reduce((count, item) => count + item.quantity, 0)
  };
};
CartSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Cart', CartSchema);