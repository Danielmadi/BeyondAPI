const sql = require('mssql')
const  SQLCON = require('../config/db.config');
const { v4: uuidv4 } = require('uuid');

// Retrieve all Customers from the database.
exports.findAll = async (req, res) => {
  try {

    const skip = req.params.skip;
    const take = req.params.take;
    const book = req.params.book;
   // console.log(req.params);
    // make sure that any items are correctly URL encoded in the connection string
   await sql.connect(SQLCON)
   // await sql.connect('Server=aa15pm8bn3sx004.cstvrifq4sia.us-west-2.rds.amazonaws.com,1433;Database=Database;User Id=SCSAdmin;Password=Silicon$$Silicon;Encrypt=false')
sql.pool =5 ;
    const query = `
    select 
    SA_Key ,
    SA_Description accountName,
    SA_Number accountNumber,
    SA_Book dataurl,   
    ISNULL(SA_Phones,'') phoneNumber,
    ISNULL(SA_Email,'') email,
    SA_CompanyKey companyKey,     
ISNULL(SA_Title,'') bankBranch,
ISNULL(SA_FinanceNumber,'') financeNumber,
   ISNULL(SA_ContactPerson,'') ibanNumber from TBM_SUB_ACCOUNT
     WHERE SA_BOOK = '${book}'
     AND SA_CompanyKey =  '${req.query.CompanyKey}'
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
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    await sql.connect(SQLCON)
    sql.pool =5 ;
    const query = ` select SA_Description accountName,
    SA_Number accountNumber,
    SA_Book dataurl,   
    ISNULL(SA_Phones,'') phoneNumber,
    ISNULL(SA_Email,'') email,
    SA_CompanyKey companyKey,     
ISNULL(SA_Title,'') bankBranch,
ISNULL(SA_FinanceNumber,'') financeNumber,
   ISNULL(SA_ContactPerson,'') ibanNumber from TBM_SUB_ACCOUNT
    WHERE SA_Key = '${id}' AND SA_CompanyKey = '${req.query.CompanyKey}'`
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
    INSERT INTO TBM_SUB_ACCOUNT 
    ( SA_Key,
      SA_CompanyKey,
      SA_Currency,
      SA_Description,
      SA_Number,
      SA_Book,
      SA_Phones,
      SA_Email,
      SA_FinanceNumber,
      SA_Title,
      SA_ContactPerson,
      SA_Freezed,
      SA_IsSalesMan
      )
    VALUES(
    '${uuidv4()}',
    '${req.query.CompanyKey}',
    '${req.query.SA_Currency}',
    '${req.query.SA_Description}',
    '${req.query.SA_Number}',
    '${req.query.SA_Book}',
    '${req.query.SA_Phones}',
    '${req.query.SA_Email}',
    '${req.query.SA_FinanceNumber}',
    '${req.query.SA_Title}',
    '${req.query.SA_ContactPerson}',
    0,
    0
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
    UPDATE TBM_SUB_ACCOUNT
    SET 
    SA_Description = '${req.query.SA_Description}',
    SA_Number = '${req.query.SA_Number}',
    SA_Book = '${req.query.SA_Book}',
    SA_Phones = '${req.query.SA_Phones}',
    SA_Email = '${req.query.SA_Email}',
    SA_FinanceNumber = '${req.query.SA_FinanceNumber}',
    SA_Title = '${req.query.SA_Title}',
    SA_ContactPerson = '${req.query.SA_ContactPerson}' 
    WHERE SA_KEY = '${id}' AND SA_CompanyKey = '${req.query.CompanyKey}'`
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
    DELETE from TBM_SUB_ACCOUNT
    WHERE SA_Key = '${id}' AND SA_CompanyKey = '${req.query.CompanyKey}'`
    const result = await sql.query(query); 
    res.send( JSON.parse(JSON.stringify(result))); 
} catch (err) {
  console.log(err);
  res.send(err);
}
};


