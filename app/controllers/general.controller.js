const sql = require('mssql')



exports.findAll = async (req, res) => {
  try {

    const PeriodKey = req.query.PeriodKey;
   
  
   await sql.connect('Server=192.168.1.147,1433;Database=BeyondDataNew;User Id=sa;Password=P@ssw0rd;Encrypt=false')
   // await sql.connect('Server=aa15pm8bn3sx004.cstvrifq4sia.us-west-2.rds.amazonaws.com,1433;Database=Database;User Id=SCSAdmin;Password=Silicon$$Silicon;Encrypt=false')
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
  console.log(err);
  res.send(err);
    // ... error checks
}
};

