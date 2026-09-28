const mongoose = require("mongoose");

const queueSchema = new mongoose.Schema(
  {
    queueName: {
      type: String,
      required: true,
      trim: true,
    },

    serviceName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    openingTime: {
      type: String,
      required: true,
    },

    closingTime: {
      type: String,
      required: true,
    },

    averageServiceTime: {
      type: Number,
      required: true,
    },

    maxCapacity: {
      type: Number,
      required: true,
    },

    currentToken: {
      type: Number,
      default: 0,
    },

    nextToken: {
      type: Number,
      default: 1,
    },

    status: {
      type: String,
      enum: ["open", "paused", "closed"],
      default: "open",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        tokenNumber: {
          type: Number,
          required: true,
        },

        joinedAt: {
          type: Date,
          default: Date.now,
        },

        status: {
          type: String,
          enum: ["waiting", "serving", "completed", "skipped"],
          default: "waiting",
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Queue", queueSchema);
