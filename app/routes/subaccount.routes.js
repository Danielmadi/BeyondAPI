module.exports = app => {
  const subaccounts = require("../controllers/subaccount.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", subaccounts.create);

  // Retrieve all Tutorials
  router.get("/:skip/:take/:book", subaccounts.findAll);

  // Retrieve a single Tutorial with id
  router.get("/:id", subaccounts.findOne);

  // Update a Tutorial with id
  router.put("/:id", subaccounts.update);

  // Delete a Tutorial with id
  router.delete("/:id", subaccounts.delete);

  app.use("/api/subaccount", router);
};
