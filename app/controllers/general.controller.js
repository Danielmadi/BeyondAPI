const sql = require('mssql')
const  SQLCON = require('../config/db.config');




exports.nextID = async (req, res) => {
  try {

    const PeriodKey = req.query.PeriodKey;
    const CompanyKey = req.query.CompanyKey;
    const table = req.query.table;
    const type = req.query.type;
    
  
   await sql.connect(SQLCON)
   // await sql.connect('Server=aa15pm8bn3sx004.cstvrifq4sia.us-west-2.rds.amazonaws.com,1433;Database=Database;User Id=SCSAdmin;Password=Silicon$$Silicon;Encrypt=false')
sql.pool =5 ;
let query = "";
switch (table) {
  case "accounts":
    query = `select  max(sa_number) result from TBM_Sub_Account
    where SA_BOOK = ${type} and SA_CompanyKey = '${CompanyKey}'`
    break;
 case "transactions":
  query = `select  max(TM_RefNo) result from TBT_AppTransMain
  where TM_Type = ${type} and TM_Period = '${PeriodKey}'`
      break;
  default:
    break;
}
   
 

    const result = await sql.query(query);
    const value =result.recordset[0].result;

    res.send(JSON.parse(JSON.stringify({"result" : incrementString(value)})) );
   
} catch (err) {
  console.log(err);
  res.send(err);
    // ... error checks
}
};


exports.findAll = async (req, res) => {
  try {

    const PeriodKey = req.query.PeriodKey;
   
  
   await sql.connect(SQLCON)
sql.pool =5 ;
    const query = `
    Select  MAX(LD_Id) LDID,
      SUM(VD_Dr)  DR,
      SUM( VD_Cr) CR,
		 AC_ID   AccCat,
      ASC_ID  AccSubCat,
        SUM(VD_Dr)  -   SUM(VD_Cr)   Balance,
      MAX( AC_Name_A) AccName,
    MAX(ASC_Name )   AccSubName
        
        from TBT_Voucher_Detail 
        left OUTER JOIN TBM_Ledger on LD_Key= VD_Ledger
        left OUTER join TBS_Account_Category on TBS_Account_Category.AC_ID = TBM_Ledger.LD_AccountCateory
          left OUTER join TBS_Account_SubCategory on TBS_Account_SubCategory.ASC_ID = TBM_Ledger.LD_AccountSubCateory
          Left outer join TBT_Voucher on VD_ParentKey = VM_Key
          WHERE  VM_Period = '${PeriodKey}'
          group by AC_ID,ASC_ID
      
    `
    //  OFFSET  ${parseInt(skip)} ROWS
    //  FETCH NEXT  ${parseInt(take)} ROWS ONLY`;


    const result = await sql.query(query);
    
    res.send( JSON.parse(JSON.stringify(result.recordset)));
   
} catch (err) {
  res.send(err);
}
};



exports.getSimpleStatment = async (req, res) => {
  try {

    const PeriodKey = req.query.PeriodKey;
    const SubAccountKey = req.query.SubAccountKey;
    
  
   await sql.connect(SQLCON)
sql.pool =5 ;
    const query = `
    SELECT 
VD_ParentKey VM_Key,
TBT_Voucher.VM_Date Date,
ISNULL(TBT_Voucher.VM_Description,'') Description,
Case WHEN VD_Dr = 0 THEN 'In' ELSE 'Out' END TextId,
VD_Equiv_BC1 Amount,
TBT_Voucher.VM_ID VoucherNumber,
TBS_Voucher_Type.VT_Name VoucherType
 from TBT_Voucher
left outer join TBT_Voucher_Detail 
on VM_Key = VD_ParentKey
left outer join TBS_Voucher_Type 
on VT_Id = VM_Type
WHERE VM_Period = '${PeriodKey}'
AND VD_Sub_Account = '${SubAccountKey}'
Order BY VM_Date   
    `
    //  OFFSET  ${parseInt(skip)} ROWS
    //  FETCH NEXT  ${parseInt(take)} ROWS ONLY`;

    const result = await sql.query(query);
    
    res.send( JSON.parse(JSON.stringify(result.recordset)));
   
} catch (err) {
  res.send(err);
}
};


exports.getDashboardAmountByCategory = async (req, res) => {
  try {

    const PeriodKey = req.query.PeriodKey;
    const AccountCAT = req.query.AccountCAT;
    
  
   await sql.connect(SQLCON)
sql.pool =5 ;
    const query = `
    select MAX(MAIN.CatId) CatId,
    Max(AccCat) AccCat,
    'dashboardDetails' target,
    Sum(DR) - Sum(CR ) balance,
     Sum(DR) DR,
    Sum(CR) CR
     FROM (
    Select 
    TBS_Account_Category.AC_ID CatId,
    TBM_Ledger.LD_Id LDID,
    VD_Dr  DR,
    VD_Cr CR,
    TBS_Account_Category.AC_Name_E AccCat,
    TBM_Ledger.LD_AccountSubCateory AccSubCat
     from 
    TBT_Voucher_Detail
    left outer join TBM_Ledger 
    on LD_Key = VD_Ledger
    left outer join TBS_Account_Category 
    on LD_AccountCateory = AC_ID
    left outer join TBT_Voucher 
on VM_Key = VD_ParentKey
WHERE AC_ID = '${AccountCAT}'
and VM_Period = '${PeriodKey}'

    ) MAIN
    Group by MAIN.AccCat	
    
      
    `
    //  OFFSET  ${parseInt(skip)} ROWS
    //  FETCH NEXT  ${parseInt(take)} ROWS ONLY`;

    const result = await sql.query(query);
    
    res.send( JSON.parse(JSON.stringify(result.recordset)));
   
} catch (err) {
  res.send(err);
}
};


function incrementString(str) {
  // Find the trailing number or it will match the empty string
  var count = str.match(/\d*$/);

  // Take the substring up until where the integer was matched
  // Concatenate it to the matched count incremented by 1
  return str.substr(0, str.length -  count.index) + (++count[0]);
};