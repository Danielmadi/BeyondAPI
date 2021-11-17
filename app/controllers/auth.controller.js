const sql = require('../config/db.config');



exports.findAll = async (req, res) => {
  try {

    const email = req.query.email;
   
    const query = `
    select 
    'OK' result,
    ISNULL(Companies.Name,'') CompanyName,
    ISNULL(PR_Description,'') PeriodName,
    ISNULL(Companies.Name,'') CompanyInitial,
   PR_KEY PeriodKey,
  ISNULL(AspNetUsers.UserName,'')  userName,
  ISNULL(AspNetUsers.UserName ,'') userInitial,
   AspNetUsers.LastCompany LastCompanyKey,
  AspNetUsers.Id  UserKey
    from AspNetUsers
    left outer join Companies on LastCompany = Companies.Id
    left outer join TBM_Period on LastPeriod = TBM_Period.PR_Key
    where email = '${email}'`
    //  OFFSET  ${parseInt(skip)} ROWS
    //  FETCH NEXT  ${parseInt(take)} ROWS ONLY`;


    const result = await sql.query(query);
    
    res.send( JSON.parse(JSON.stringify(result.recordset[0])));
   
} catch (err) {
  console.log(err);
  res.send(err);
    // ... error checks
}
};

