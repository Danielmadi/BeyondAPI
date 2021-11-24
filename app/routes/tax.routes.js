module.exports = app => {
  const taxes = require("../controllers/tax.controller.js");

  var router = require("express").Router();

  // Create a new Record
  router.post("/", taxes.create);

  // Retrieve all Records
  router.get("/:skip/:take", taxes.findAll);

  // Retrieve a single Record with id
  router.get("/:id", taxes.findOne);

  // Update a Record with id
  router.put("/:id", taxes.update);

  // Delete a Record with id
  router.delete("/:id", taxes.delete);

  // Create a new Record
  // router.delete("/", taxes.deleteAll);

  app.use("/api/tax", router);
};
