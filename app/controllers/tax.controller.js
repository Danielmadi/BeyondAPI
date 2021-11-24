const sql = require('mssql')
const  SQLCON = require('../config/db.config');


// Retrieve all Customers from the database.
exports.findAll = async (req, res) => {
  try {

    const skip = req.params.skip;
    const take = req.params.take;
    // const book = req.params.book;
   // console.log(req.params);
    // make sure that any items are correctly URL encoded in the connection string
   await sql.connect(SQLCON)
   // await sql.connect('Server=aa15pm8bn3sx004.cstvrifq4sia.us-west-2.rds.amazonaws.com,1433;Database=Database;User Id=SCSAdmin;Password=Silicon$$Silicon;Encrypt=false')
sql.pool =5 ;
    const query = `
    select VAT_ID TaxId,VAT_NAME TaxName,VAT_RATE TaxRate from TBS_VAT
    WHERE VAT_CompanyKey = '${req.query.CompanyKey}'
     ORDER BY VAT_ID`
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
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    await sql.connect(SQLCON)
    sql.pool =5 ;
    const query = `
    select VAT_ID TaxId,VAT_NAME TaxName,VAT_RATE TaxRate from TBS_VAT
    WHERE VAT_ID = '${id}' AND VAT_CompanyKey = '${req.query.CompanyKey}'
     ORDER BY VAT_ID`
    const result = await sql.query(query); 
    res.send( JSON.parse(JSON.stringify(result.recordset[0]))); 
} catch (err) {
  console.log(err);
  res.send(err);
}
};




exports.create = async (req, res) => {
  try {
    await sql.connect(SQLCON)
    sql.pool =5 ;
    const query = `
    INSERT INTO TBS_VAT 
    (VAT_NAME,
    VAT_Rate,
    VAT_CompanyKey)
    VALUES(
    '${req.query.TaxName}',
    ${req.query.TaxRate},
    '${req.query.CompanyKey}'
    )`
    const result = await sql.query(query); 
    res.send( JSON.parse(JSON.stringify(result))); 
} catch (err) {
  console.log(err);
  res.send(err);
}
};
// Update a Customer by the id in the request
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    await sql.connect(SQLCON)
    sql.pool =5 ;
    const query = `
    UPDATE TBS_VAT
    SET VAT_Name = '${req.query.TaxName}',
    VAT_Rate = ${req.query.TaxRate}
    WHERE VAT_ID = '${id}' AND VAT_CompanyKey = '${req.query.CompanyKey}'`
    const result = await sql.query(query); 
    res.send( JSON.parse(JSON.stringify(result))); 
} catch (err) {
  console.log(err);
  res.send(err);
}
};

// Delete a Customer with the specified id in the request
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await sql.connect(SQLCON)
    sql.pool =5 ;
    const query = `
    DELETE from TBS_VAT
    WHERE VAT_ID = '${id}' AND VAT_CompanyKey = '${req.query.CompanyKey}'`
    const result = await sql.query(query); 
    res.send( JSON.parse(JSON.stringify(result))); 
} catch (err) {
  console.log(err);
  res.send(err);
}
};


