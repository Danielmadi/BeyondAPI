module.exports = app => {
  const companies = require("../controllers/company.controller.js");

  var router = require("express").Router();

  // Create a new Record
 // router.post("/", companies.create);

  // Retrieve all Records
  //router.get("/:skip/:take", companies.findAll);

  // Retrieve a single Record with id
  router.get("/:id", companies.findOne);

  // Update a Record with id
  router.put("/:id", companies.update);

  // Delete a Record with id
 //  router.delete("/:id", companies.delete);

  // Create a new Record
  // router.delete("/", companies.deleteAll);

  app.use("/api/company", router);
};
