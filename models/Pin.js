const mongoose = require('mongoose');

const PinSchema = mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    picture: { type: String },
    title: { type: String },
    content: { type: String },
    image: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    comments: [
      {
        text: String,
        createdAt: { type: Date, default: Date.now },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'User',
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pin', PinSchema);
