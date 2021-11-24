const sql = require('mssql')
const  SQLCON = require('../config/db.config');
const { v4: uuidv4 } = require('uuid');

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
    select PT_Description PDescription,PT_Type PType from TBS_AppPaymentTypes
    WHERE PT_CompanyKey = '${req.query.CompanyKey}'`
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
    select PT_Description PDescription,PT_Type PType from TBS_AppPaymentTypes
    WHERE PT_Key = '${id}' AND PT_CompanyKey = '${req.query.CompanyKey}'`
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
    INSERT INTO TBS_AppPaymentTypes 
    (PT_Key,
    PT_Type,
    PT_Description,
    PT_CompanyKey)
    VALUES(
      '${uuidv4()}',
    ${req.query.PType},
    '${req.query.PDescription}',
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
    UPDATE TBS_AppPaymentTypes
    SET PT_Description = '${req.query.PDescription}',
    PT_Type = ${req.query.PType}
    WHERE PT_Key = '${id}' AND PT_CompanyKey = '${req.query.CompanyKey}'`
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
    DELETE from TBS_AppPaymentTypes
    WHERE PT_Key = '${id}' AND PT_CompanyKey = '${req.query.CompanyKey}'`
    const result = await sql.query(query); 
    res.send( JSON.parse(JSON.stringify(result))); 
} catch (err) {
  console.log(err);
  res.send(err);
}
};


