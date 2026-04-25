const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const tripSchema = new mongoose.Schema(
  {
    // Trip creator (driver)
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Trip details
    departure: {
      type: String,
      required: true,
      trim: true,
    },

    destination: {
      type: String,
      required: true,
      trim: true,
    },

    departureTime: {
      type: Date,
      required: true,
    },

    // Vehicle information
    carType: {
      type: String,
      enum: ['compact', 'sedan', 'suv', 'van', 'truck'],
      required: true,
    },

    carModel: {
      type: String,
      trim: true,
    },

    licensePlate: {
      type: String,
      trim: true,
    },

    // Capacity and pricing
    totalSeats: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },

    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },

    pricePerSeat: {
      type: Number,
      required: true,
      min: 0,
    },

    // Passengers who booked
    passengers: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        seatsBooked: {
          type: Number,
          required: true,
          min: 1,
        },
        bookedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ['pending', 'confirmed', 'cancelled'],
          default: 'confirmed',
        },
      },
    ],

    // Trip status
    status: {
      type: String,
      enum: ['upcoming', 'in-progress', 'completed', 'cancelled'],
      default: 'upcoming',
    },

    // Additional details
    description: {
      type: String,
      trim: true,
    },

    allowPets: {
      type: Boolean,
      default: false,
    },

    allowSmoking: {
      type: Boolean,
      default: false,
    },

    allowMusic: {
      type: Boolean,
      default: true,
    },

    // Route waypoints (optional)
    waypoints: [
      {
        location: String,
        latitude: Number,
        longitude: Number,
      },
    ],
  },
  { timestamps: true }
);

// Virtual to get total booked seats
tripSchema.virtual('totalBookedSeats').get(function () {
  return this.passengers.reduce((sum, passenger) => sum + passenger.seatsBooked, 0);
});

// Ensure virtuals are serialized
tripSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Trip', tripSchema);