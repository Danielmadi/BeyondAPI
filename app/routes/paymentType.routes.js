module.exports = app => {
  const paymentTypes = require("../controllers/paymentType.controller.js");

  var router = require("express").Router();

  // Create a new Record
  router.post("/", paymentTypes.create);

  // Retrieve all Records
  router.get("/:skip/:take", paymentTypes.findAll);

  // Retrieve a single Record with id
  router.get("/:id", paymentTypes.findOne);

  // Update a Record with id
  router.put("/:id", paymentTypes.update);

  // Delete a Record with id
  router.delete("/:id", paymentTypes.delete);

  // Create a new Record
  // router.delete("/", paymentTypes.deleteAll);

  app.use("/api/paymentType", router);
};
