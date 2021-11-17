const sql = require('../config/db.config');


// Create and Save a new Customer
exports.create = (req, res) => {

  
};

// Retrieve all Customers from the database.
exports.findAll = async (req, res) => {
  try {

    const skip = req.params.skip;
    const take = req.params.take;
    const book = req.params.book;
 
    const query = `
     select SA_Key,SA_Description,SA_Phones from TBM_SUB_ACCOUNT
     WHERE SA_BOOK = ${book}
     ORDER BY SA_Number`
    //  OFFSET  ${parseInt(skip)} ROWS
    //  FETCH NEXT  ${parseInt(take)} ROWS ONLY`;


    const result = await sql.query(query);
    
    res.send( JSON.parse(JSON.stringify(result.recordset)));
   
} catch (err) {
  console.log(err);
  res.send(err);
    // ... error checks
}
};

// Find a single Customer with an id
exports.findOne = (req, res) => {
 
};

// Update a Customer by the id in the request
exports.update = (req, res) => {
 
};

// Delete a Customer with the specified id in the request
exports.delete = (req, res) => {
 
};

// Delete all Customers from the database.
exports.deleteAll = (req, res) => {
  
};

// find all published Customer
exports.findAllPublished = (req, res) => {
  
};
