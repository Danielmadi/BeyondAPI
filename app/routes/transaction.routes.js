module.exports = app => {
  const transactions = require("../controllers/transaction.controller.js");

  var router = require("express").Router();

  // Create a new Record
  router.post("/", transactions.create);

  // Retrieve all Records
  router.get("/:skip/:take", transactions.findAll);

  // Retrieve a single Record with id
  router.get("/:id", transactions.findOne);

  // Update a Record with id
  router.put("/:id", transactions.update);

  // Delete a Record with id
  router.delete("/:id", transactions.delete);

  // Create a new Record
  // router.delete("/", transactions.deleteAll);

  app.use("/api/transaction", router);
};
