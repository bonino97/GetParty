const mongoose = require('mongoose');

const PinSchema = mongoose.Schema(
  {
    title: String,
    content: String,
    image: String,
    latitude: Number,
    longitude: Number,

    partyType: String,
    musicType: String,
    slug: String,
    availableTickets: Number,
    priceOfTicket: Number,

    startDate: Date,
    startTime: Date,
    endDate: Date,
    endTime: Date,

    entryRequirements: String,

    periodicEvent: Boolean,

    location: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },

    takeFees: Boolean,
    publicParty: Boolean,
    tags: [String],

    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    staff: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    ],
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    ],

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
