const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum:['male','female','other'],
    },
    address: {
      type: String,
    },
    country: {
      type: String,
    },
    phone: {
      type: String,
    },
    img: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  { timestamps: true }
);

UserSchema.pre('save', function (next) {
  const user = this;
  if (!user.userId) {
    const randomNumber = Math.floor(Math.random() * 900) + 100;
    user.userId = user.username.toUpperCase() + '_' + randomNumber;
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);
