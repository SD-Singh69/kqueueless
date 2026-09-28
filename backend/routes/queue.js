const express = require("express");
const auth = require("../middleware/auth");
const Queue = require("../models/Queue");

module.exports = (io) => {
  const router = express.Router();
  router.get("/test", (req, res) => {
    res.json({
      message: "Queue router is working",
    });
  });

  // POST /api/queues
  // GET /api/queues/my
  // Get queues created by logged-in owner
  router.get("/my", auth, async (req, res) => {
    try {
      const queues = await Queue.find({
        owner: req.user.id,
      }).sort({ createdAt: -1 });

      res.json({
        queues,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server error",
      });
    }
  });
  // GET /api/queues
  // Get all open queues for customers
  router.get("/", async (req, res) => {
    try {
      const queues = await Queue.find({
        status: "open",
      })
        .populate("owner", "name shopName")
        .sort({ createdAt: -1 });

      res.json({
        queues,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server error",
      });
    }
  });
  // GET /api/queues/:id
  // Get a specific queue
  router.get("/:id", async (req, res) => {
    try {
      const queue = await Queue.findById(req.params.id).populate(
        "owner",
        "name shopName",
      );

      if (!queue) {
        return res.status(404).json({
          message: "Queue not found",
        });
      }

      if (queue.status !== "open") {
        return res.status(400).json({
          message: "Queue is not open",
        });
      }

      res.json({
        queue,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server error",
      });
    }
  });
  // POST /api/queues/:id/join
  // Customer joins a queue
  router.post("/:id/join", auth, async (req, res) => {
    try {
      const queue = await Queue.findById(req.params.id);

      if (!queue) {
        return res.status(404).json({
          message: "Queue not found",
        });
      }

      // Check if queue is open
      if (queue.status !== "open") {
        return res.status(400).json({
          message: "Queue is not open",
        });
      }

      // Check queue capacity
      const waitingCustomers = queue.customers.filter(
        (customer) => customer.status === "waiting",
      );

      if (waitingCustomers.length >= queue.maxCapacity) {
        return res.status(400).json({
          message: "Queue is full",
        });
      }

      // Check if customer already joined
      const alreadyJoined = queue.customers.find(
        (customer) =>
          customer.user.toString() === req.user.id &&
          ["waiting", "serving"].includes(customer.status),
      );

      if (alreadyJoined) {
        return res.status(400).json({
          message: "You have already joined this queue",
          tokenNumber: alreadyJoined.tokenNumber,
        });
      }

      // Assign token
      const tokenNumber = queue.nextToken;

      queue.customers.push({
        user: req.user.id,
        tokenNumber,
        status: "waiting",
      });

      queue.nextToken += 1;

      await queue.save();
      io.to(`queue_${queue._id}`).emit("queueUpdated", {
        queueId: queue._id,
        action: "customerJoined",
      });

      res.status(201).json({
        message: "Joined queue successfully",
        tokenNumber,
        queueId: queue._id,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server error",
      });
    }
  });
  // GET /api/queues/:id/status
  // Get customer's position in queue
  router.get("/:id/status", auth, async (req, res) => {
    try {
      const queue = await Queue.findById(req.params.id);

      if (!queue) {
        return res.status(404).json({
          message: "Queue not found",
        });
      }

      const customer = queue.customers.find(
        (customer) =>
          customer.user.toString() === req.user.id &&
          ["waiting", "serving"].includes(customer.status),
      );

      if (!customer) {
        return res.status(404).json({
          message: "You have not joined this queue",
        });
      }

      const peopleAhead = queue.customers.filter(
        (item) =>
          item.status === "waiting" && item.tokenNumber < customer.tokenNumber,
      ).length;

      const estimatedWaitTime = peopleAhead * queue.averageServiceTime;

      res.json({
        queueName: queue.queueName,
        tokenNumber: customer.tokenNumber,
        currentToken: queue.currentToken,
        status: customer.status,
        peopleAhead,
        estimatedWaitTime,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server error",
      });
    }
  });

  // POST /api/queues/:id/exit
  // Customer exits the queue
  router.post("/:id/exit", auth, async (req, res) => {
    try {
      const queue = await Queue.findById(req.params.id);

      if (!queue) {
        return res.status(404).json({
          message: "Queue not found",
        });
      }

      const customer = queue.customers.find(
        (customer) =>
          customer.user.toString() === req.user.id &&
          ["waiting", "serving"].includes(customer.status),
      );

      if (!customer) {
        return res.status(404).json({
          message: "You are not currently in this queue",
        });
      }

      // Remove customer from queue
      queue.customers = queue.customers.filter(
        (item) => item._id.toString() !== customer._id.toString(),
      );

      await queue.save();

      // Notify connected users
      io.to(`queue_${queue._id}`).emit("queueUpdated", {
        queueId: queue._id,
        action: "customerExited",
      });

      res.json({
        message: "Exited queue successfully",
      });
    } catch (error) {
      console.error("EXIT QUEUE ERROR:", error);

      res.status(500).json({
        message: "Server error",
      });
    }
  });
  // POST /api/queues/:id/next
  // Owner calls the next customer
  router.post("/:id/next", auth, async (req, res) => {
    try {
      const queue = await Queue.findById(req.params.id);

      if (!queue) {
        return res.status(404).json({
          message: "Queue not found",
        });
      }

      // Make sure only the owner can call the next customer
      if (queue.owner.toString() !== req.user.id) {
        return res.status(403).json({
          message: "You are not allowed to manage this queue",
        });
      }

      // Find the first waiting customer
      const nextCustomer = queue.customers.find(
        (customer) => customer.status === "waiting",
      );

      if (!nextCustomer) {
        return res.status(400).json({
          message: "No customers are waiting",
        });
      }

      // Mark customer as serving
      nextCustomer.status = "serving";

      // Update current token
      queue.currentToken = nextCustomer.tokenNumber;

      // Save queue
      await queue.save();

      // Send real-time update
      io.to(`queue_${queue._id}`).emit("queueUpdated", {
        queueId: queue._id,
        currentToken: queue.currentToken,
        tokenNumber: nextCustomer.tokenNumber,
        status: nextCustomer.status,
      });

      res.json({
        message: "Next customer called",
        tokenNumber: nextCustomer.tokenNumber,
        currentToken: queue.currentToken,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server error",
      });
    }
  });
  // POST /api/queues/:id/complete
  // Owner completes the current customer
  router.post("/:id/complete", auth, async (req, res) => {
    try {
      const queue = await Queue.findById(req.params.id);

      if (!queue) {
        return res.status(404).json({
          message: "Queue not found",
        });
      }

      // Only owner can manage the queue
      if (queue.owner.toString() !== req.user.id) {
        return res.status(403).json({
          message: "You are not allowed to manage this queue",
        });
      }

      // Find currently serving customer
      const currentCustomer = queue.customers.find(
        (customer) => customer.status === "serving",
      );

      if (!currentCustomer) {
        return res.status(400).json({
          message: "No customer is currently being served",
        });
      }

      // Mark customer as completed
      currentCustomer.status = "completed";

      await queue.save();

      res.json({
        message: "Customer completed successfully",
        tokenNumber: currentCustomer.tokenNumber,
        currentToken: queue.currentToken,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server error",
      });
    }
  });
  // POST /api/queues/:id/skip
  // Owner skips the current customer
  router.post("/:id/skip", auth, async (req, res) => {
    try {
      const queue = await Queue.findById(req.params.id);

      if (!queue) {
        return res.status(404).json({
          message: "Queue not found",
        });
      }

      // Only owner can manage the queue
      if (queue.owner.toString() !== req.user.id) {
        return res.status(403).json({
          message: "You are not allowed to manage this queue",
        });
      }

      // Find currently serving customer
      const currentCustomer = queue.customers.find(
        (customer) => customer.status === "serving",
      );

      if (!currentCustomer) {
        return res.status(400).json({
          message: "No customer is currently being served",
        });
      }

      // Mark customer as skipped
      currentCustomer.status = "skipped";

      await queue.save();

      res.json({
        message: "Customer skipped successfully",
        tokenNumber: currentCustomer.tokenNumber,
        currentToken: queue.currentToken,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server error",
      });
    }
  });
  // PUT /api/queues/:id
  // Owner updates queue details
  router.put("/:id", auth, async (req, res) => {
    try {
      const queue = await Queue.findById(req.params.id);

      if (!queue) {
        return res.status(404).json({
          message: "Queue not found",
        });
      }

      // Only owner can edit the queue
      if (queue.owner.toString() !== req.user.id) {
        return res.status(403).json({
          message: "You are not allowed to edit this queue",
        });
      }

      const {
        queueName,
        serviceName,
        description,
        location,
        openingTime,
        closingTime,
        averageServiceTime,
        maxCapacity,
      } = req.body;

      // Update only the fields provided
      if (queueName !== undefined) queue.queueName = queueName;
      if (serviceName !== undefined) queue.serviceName = serviceName;
      if (description !== undefined) queue.description = description;
      if (location !== undefined) queue.location = location;
      if (openingTime !== undefined) queue.openingTime = openingTime;
      if (closingTime !== undefined) queue.closingTime = closingTime;
      if (averageServiceTime !== undefined)
        queue.averageServiceTime = averageServiceTime;
      if (maxCapacity !== undefined) queue.maxCapacity = maxCapacity;

      await queue.save();

      // Tell connected clients that queue details changed
      io.to(`queue_${queue._id}`).emit("queueUpdated", {
        queueId: queue._id,
        action: "queueUpdated",
      });

      res.json({
        message: "Queue updated successfully",
        queue,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server error",
      });
    }
  });
  // DELETE /api/queues/:id
  // Owner deletes their queue
  router.delete("/:id", auth, async (req, res) => {
    try {
      const queue = await Queue.findById(req.params.id);

      if (!queue) {
        return res.status(404).json({
          message: "Queue not found",
        });
      }

      if (queue.owner.toString() !== req.user.id) {
        return res.status(403).json({
          message: "You are not allowed to delete this queue",
        });
      }

      await Queue.findByIdAndDelete(req.params.id);

      io.to(`queue_${queue._id}`).emit("queueUpdated", {
        queueId: queue._id,
        action: "queueDeleted",
      });

      res.json({
        message: "Queue deleted successfully",
        queueId: queue._id,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server error",
      });
    }
  });
  // POST /api/queues/:id/pause
  // Owner pauses the queue
  router.post("/:id/pause", auth, async (req, res) => {
    try {
      const queue = await Queue.findById(req.params.id);

      if (!queue) {
        return res.status(404).json({
          message: "Queue not found",
        });
      }

      // Only owner can manage the queue
      if (queue.owner.toString() !== req.user.id) {
        return res.status(403).json({
          message: "You are not allowed to manage this queue",
        });
      }

      if (queue.status === "paused") {
        return res.status(400).json({
          message: "Queue is already paused",
        });
      }

      if (queue.status === "closed") {
        return res.status(400).json({
          message: "Queue is closed",
        });
      }

      queue.status = "paused";

      await queue.save();

      res.json({
        message: "Queue paused successfully",
        status: queue.status,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server error",
      });
    }
  });
  // POST /api/queues/:id/resume
  // Owner resumes the queue
  router.post("/:id/resume", auth, async (req, res) => {
    try {
      const queue = await Queue.findById(req.params.id);

      if (!queue) {
        return res.status(404).json({
          message: "Queue not found",
        });
      }

      // Only owner can manage the queue
      if (queue.owner.toString() !== req.user.id) {
        return res.status(403).json({
          message: "You are not allowed to manage this queue",
        });
      }

      if (queue.status === "open") {
        return res.status(400).json({
          message: "Queue is already open",
        });
      }

      if (queue.status === "closed") {
        return res.status(400).json({
          message: "Queue is closed",
        });
      }

      queue.status = "open";

      await queue.save();

      res.json({
        message: "Queue resumed successfully",
        status: queue.status,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server error",
      });
    }
  });
  // Create a new queue
  router.post("/", auth, async (req, res) => {
    try {
      const {
        queueName,
        serviceName,
        description,
        location,
        openingTime,
        closingTime,
        averageServiceTime,
        maxCapacity,
      } = req.body;

      // Check required fields
      if (
        !queueName ||
        !serviceName ||
        !location ||
        !openingTime ||
        !closingTime ||
        !averageServiceTime ||
        !maxCapacity
      ) {
        return res.status(400).json({
          message: "Please provide all required fields",
        });
      }

      // Create queue
      const queue = await Queue.create({
        queueName,
        serviceName,
        description,
        location,
        openingTime,
        closingTime,
        averageServiceTime,
        maxCapacity,
        owner: req.user.id,
      });

      res.status(201).json({
        message: "Queue created successfully",
        queue,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server error",
      });
    }
  });

  return router;
};
