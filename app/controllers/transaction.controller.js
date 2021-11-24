const sql = require('mssql')
const  SQLCON = require('../config/db.config');
const { v4: uuidv4 } = require('uuid');

// Retrieve all Customers from the database.
exports.findAll = async (req, res) => {
  try {

    const skip = req.params.skip;
    const take = req.params.take;
    const PeriodKey = req.query.PeriodKey;
    const Type = req.query.Type;
    const search = req.query.search;
    // const book = req.params.book;
   // console.log(req.params);
    // make sure that any items are correctly URL encoded in the connection string
   await sql.connect(SQLCON)
   // await sql.connect('Server=aa15pm8bn3sx004.cstvrifq4sia.us-west-2.rds.amazonaws.com,1433;Database=Database;User Id=SCSAdmin;Password=Silicon$$Silicon;Encrypt=false')
sql.pool =5 ;
    const query = `
    select 
TBT_AppTransMain.TA_Key TransKey,
TBT_AppTransMain.TA_Date TransDate,
TBT_AppTransMain.TA_Description TransDescription,
TD_Amount TransAmount,
TBM_Sub_Account.SA_Description TransAcount,
TBT_AppTransMain.TA_RefNo TransRefNumber
from TBT_AppTransMain
left outer  join TBT_AppTransDetails
on TA_Key = TD_Key
left outer join TBM_Sub_Account
on SA_Key = TD_SubAccount
where TA_Period = '${PeriodKey}' AND
TA_TYPE = ${Type}
 AND (ISNULL(TA_Description,'') + ISNULL(TA_RefNo,'')) like '%${search}%'
Order by TransDate
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

// Find a single Customer with an id
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    await sql.connect(SQLCON)
    sql.pool =5 ;
    const query = `
    SELECT 
    TBT_AppTransMain.TA_Key TransKey,
    TBT_AppTransMain.TA_Date TransDate,
    TBT_AppTransMain.TA_RefNo TA_RefNo,
    TBT_AppTransMain.TA_Description TransDescription,
    TD_Amount TransAmount,
    TBM_Sub_Account.SA_Description TransAcount,
    TD_SubAccount CustomerKey,
    TBM_Sub_Account.SA_Description CustomerDesc,
    TD_ChargeAmount TD_ChargeAmount,
    TD_PaymentType TD_PaymentType,
    TBS_AppPaymentTypes.PT_Description PaymentDescription,
    TD_TaxAmount TD_TaxAmount,
    TD_VatType TD_TaxId,
    TBS_Vat.VAT_Name TD_TaxDescription,
    TD_MethodSubAccount MethodSubAccount,
    TBM_Sub_Account.SA_Description MethodSubAccountDescription,
    TD_Key TD_Key
                                           
    FROM TBT_AppTransMain
    left outer join TBT_AppTransDetails
    on TA_Key = TD_ParentKey
    left outer join TBM_Sub_Account
    on TD_SubAccount = SA_Key
    left outer join TBS_AppPaymentTypes
    on TBS_AppPaymentTypes.PT_Key = TD_PaymentType
    Left outer join TBS_VAT 
    on VAT_ID = TD_VatType
    WHERE TA_Key = '${id}'`
    const result = await sql.query(query); 
    res.send( JSON.parse(JSON.stringify(result.recordset[0]))); 
} catch (err) {
  console.log(err);
  res.send(err);
}
};




exports.create = async (req, res) => {
  try {
    await sql.connect(SQLCON);
    sql.pool =5 ;
    
    const PeriodKey = req.query.PeriodKey;
    const CategoryKey = req.query.CategoryKey;
    const SubAccountKey = req.query.SubAccountKey;
    const OtherSubAccountKey = req.query.OtherSubAccountKey;
    const PaymentType = req.query.PaymentType;
    const Type = req.query.Type;
    const CompanyKey = req.query.CompanyKey;
    const VoucherID = req.query.VoucherID;
    const VoucherDate = req.query.VoucherDate;
    const VoucherDescription = req.query.VoucherDescription;
    const Amount = req.query.Amount;
    const TaxAmount = req.query.TaxAmount;
    const ChargeAmount = req.query.ChargeAmount;
    const TaxType = req.query.TaxType;
    const Ref = req.query.Ref;
    const TransKey = req.query.TransKey;

    const TotalAmount = parseFloat(Amount) + parseFloat(TaxAmount) + parseFloat(ChargeAmount);

    const query = `
    BEGIN TRY
BEGIN TRANSACTION
DECLARE @TRANSKEY as uniqueidentifier = NEWID()
DECLARE @VOUCHERKEY as uniqueidentifier = NEWID()
DECLARE @PERIOD as uniqueidentifier = '${PeriodKey}'
DECLARE @CATEGORY as uniqueidentifier = '${CategoryKey}'
DECLARE @SUBACCOUNT as uniqueidentifier = '${SubAccountKey}'
DECLARE @OTHERSUBACCOUNT as uniqueidentifier = '${OtherSubAccountKey}'
DECLARE @PAYMENTTYPE as uniqueidentifier = '${PaymentType}'
DECLARE @TYPE as INT = ${Type}
DECLARE @COMPANYKEY as uniqueidentifier = '${CompanyKey}'
DECLARE @Currency as  uniqueidentifier= (Select  top 1 CC_Key FROM TBS_Currency WHERE CC_Id = 1 AND CC_CompanyKey =@COMPANYKEY )
DECLARE @CurrencyRateBC1 as nvarchar(MAX) = (Select  top 1 CC_Rate_BC1 FROM TBS_Currency WHERE CC_Id = 1 AND CC_CompanyKey =@COMPANYKEY )
DECLARE @CurrencyRateBC2 as nvarchar(MAX) = (Select  top 1 CC_Rate_BC2 FROM TBS_Currency WHERE CC_Id = 1 AND CC_CompanyKey =@COMPANYKEY )
DECLARE @DebitLedger as uniqueidentifier = (select top 1 CG_DebitLedger from TBS_CustomCategories	where CG_CompanyKey  =@COMPANYKEY and CG_Type = @TYPE )
DECLARE @CreditLedger as uniqueidentifier = (select top 1 CG_CreditLedger from TBS_CustomCategories	where CG_CompanyKey  =@COMPANYKEY and CG_Type = @TYPE )
DECLARE @VoucherType as INT = (select top 1 CG_VoucherType from TBS_CustomCategories	where CG_CompanyKey  =@COMPANYKEY and CG_Type = @TYPE )

DECLARE @VoucherID as nvarchar(MAX) = '${VoucherID}'
DECLARE @VoucherDATE as nvarchar(MAX) ='${VoucherDate}'
DECLARE @VoucherDesc as nvarchar(MAX) ='${VoucherDescription}'
DECLARE @amount as FLOAT = ${Amount}
DECLARE @taxAmount as FLOAT = ${TaxAmount}
DECLARE @chargeAmount as FLOAT = ${ChargeAmount}
DECLARE @taxType as INT = ${TaxType}
DECLARE @ref as nvarchar(MAX) = '${Ref}'

DECLARE @TRANSKEYY as uniqueidentifier  = '${TransKey}'
DECLARE @VOCUHERKEYY as uniqueidentifier = (SELECt top 1 TA_VoucherGuid FROM TBT_AppTransMain WHERE TA_Key = @TRANSKEYY)
Delete from TBT_Voucher_Detail WHERE VD_ParentKey =@VOCUHERKEYY
Delete from tbt_voucher WHERE VM_Key = @VOCUHERKEYY

DELETE FROM TBT_AppTransMain WHERE TA_KEY =@TRANSKEYY
DELETE FROM TBT_AppTransDetails WHERE TD_ParentKey = @TRANSKEYY

INSERT INTO TBT_Voucher 
(VM_Key,VM_ID,VM_Period,VM_Type,VM_Date,VM_Description,VM_Posted,VM_Freezed,VM_From_To,VM_TotalAmount,VM_TotalAmount_BC1,VM_TotalAmount_BC2,VM_RefNo,VM_Currency)
VALUES(@VOUCHERKEY,@VoucherID,@PERIOD,@VoucherType,@VoucherDATE,@VoucherDesc,1,0,'From App',${TotalAmount},${TotalAmount},${TotalAmount} * @CurrencyRateBC2,@ref,@Currency)



INSERT INTO TBT_Voucher_Detail
(VD_Key,VD_ParentKey,VD_LineNumber,VD_Currency,VD_BC1_Rate,VD_BC2_Rate
,VD_Ledger,VD_Sub_Account,VD_Dr,VD_Cr,VD_Equiv_BC1,VD_Equiv_BC2)
VALUES(NEWID(),@VOUCHERKEY,0,@Currency,@CurrencyRateBC1,@CurrencyRateBC2,@DebitLedger,
@SubAccount,@amount,0,@amount,@amount * @CurrencyRateBC2)

INSERT INTO TBT_Voucher_Detail
(VD_Key,VD_ParentKey,VD_LineNumber,VD_Currency,VD_BC1_Rate,VD_BC2_Rate
,VD_Ledger,VD_Sub_Account,VD_Dr,VD_Cr,VD_Equiv_BC1,VD_Equiv_BC2)
VALUES(NEWID(),@VOUCHERKEY,1,@Currency,@CurrencyRateBC1,@CurrencyRateBC2,@CreditLedger,
@SubAccount,0,@amount,@amount,@amount * @CurrencyRateBC2)




INSERT INTO TBT_AppTransMain
(TA_Key,TA_ID,TA_RefNo,TA_Date,TA_Description,TA_Period,TA_Type,TA_VoucherGuid)
VALUES(@TRANSKEY,@VoucherID,@ref,@VoucherDATE,@VoucherDesc,@PERIOD,@TYPE,@VOUCHERKEY)

INSERT INTO TBT_AppTransDetails
(TD_Key,TD_ParentKey,TD_CatorgoryGuid,TD_Amount,TD_TaxAmount,TD_ChargeAmount,TD_SubAccount
,TD_MethodSubAccount,TD_PaymentType,TD_VatType)
VALUES(NEWID(),@TRANSKEY,@CATEGORY,@amount,@taxAmount,
@chargeAmount,@SUBACCOUNT,@OTHERSUBACCOUNT,@PAYMENTTYPE,@taxType)




COMMIT
END TRY
BEGIN CATCH
  IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION --RollBack in case of Error
    DECLARE @ErrorMessage NVARCHAR(4000);  
    DECLARE @ErrorSeverity INT;  
    DECLARE @ErrorState INT;  

    SELECT   
       @ErrorMessage = ERROR_MESSAGE(),  
       @ErrorSeverity = ERROR_SEVERITY(),  
       @ErrorState = ERROR_STATE();  

    RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState); 

END CATCH


   `
   console.log(query);
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
    await sql.connect(SQLCON);
    sql.pool =5 ;
    
    const PeriodKey = req.query.PeriodKey;
    const CategoryKey = req.query.CategoryKey;
    const SubAccountKey = req.query.SubAccountKey;
    const OtherSubAccountKey = req.query.OtherSubAccountKey;
    const PaymentType = req.query.PaymentType;
    const Type = req.query.Type;
    const CompanyKey = req.query.CompanyKey;
    const VoucherID = req.query.VoucherID;
    const VoucherDate = req.query.VoucherDate;
    const VoucherDescription = req.query.VoucherDescription;
    const Amount = req.query.Amount;
    const TaxAmount = req.query.TaxAmount;
    const ChargeAmount = req.query.ChargeAmount;
    const TaxType = req.query.TaxType;
    const Ref = req.query.Ref;
    const TransKey = req.query.TransKey;

    const TotalAmount = parseFloat(Amount) + parseFloat(TaxAmount) + parseFloat(ChargeAmount);

    const query = `
    BEGIN TRY
BEGIN TRANSACTION
DECLARE @TRANSKEY as uniqueidentifier = NEWID()
DECLARE @VOUCHERKEY as uniqueidentifier = NEWID()
DECLARE @PERIOD as uniqueidentifier = '${PeriodKey}'
DECLARE @CATEGORY as uniqueidentifier = '${CategoryKey}'
DECLARE @SUBACCOUNT as uniqueidentifier = '${SubAccountKey}'
DECLARE @OTHERSUBACCOUNT as uniqueidentifier = '${OtherSubAccountKey}'
DECLARE @PAYMENTTYPE as uniqueidentifier = '${PaymentType}'
DECLARE @TYPE as INT = ${Type}
DECLARE @COMPANYKEY as uniqueidentifier = '${CompanyKey}'
DECLARE @Currency as  uniqueidentifier= (Select  top 1 CC_Key FROM TBS_Currency WHERE CC_Id = 1 AND CC_CompanyKey =@COMPANYKEY )
DECLARE @CurrencyRateBC1 as nvarchar(MAX) = (Select  top 1 CC_Rate_BC1 FROM TBS_Currency WHERE CC_Id = 1 AND CC_CompanyKey =@COMPANYKEY )
DECLARE @CurrencyRateBC2 as nvarchar(MAX) = (Select  top 1 CC_Rate_BC2 FROM TBS_Currency WHERE CC_Id = 1 AND CC_CompanyKey =@COMPANYKEY )
DECLARE @DebitLedger as uniqueidentifier = (select top 1 CG_DebitLedger from TBS_CustomCategories	where CG_CompanyKey  =@COMPANYKEY and CG_Type = @TYPE )
DECLARE @CreditLedger as uniqueidentifier = (select top 1 CG_CreditLedger from TBS_CustomCategories	where CG_CompanyKey  =@COMPANYKEY and CG_Type = @TYPE )
DECLARE @VoucherType as INT = (select top 1 CG_VoucherType from TBS_CustomCategories	where CG_CompanyKey  =@COMPANYKEY and CG_Type = @TYPE )

DECLARE @VoucherID as nvarchar(MAX) = '${VoucherID}'
DECLARE @VoucherDATE as nvarchar(MAX) ='${VoucherDate}'
DECLARE @VoucherDesc as nvarchar(MAX) ='${VoucherDescription}'
DECLARE @amount as FLOAT = ${Amount}
DECLARE @taxAmount as FLOAT = ${TaxAmount}
DECLARE @chargeAmount as FLOAT = ${ChargeAmount}
DECLARE @taxType as INT = ${TaxType}
DECLARE @ref as nvarchar(MAX) = '${Ref}'

DECLARE @TRANSKEYY as uniqueidentifier  = '${TransKey}'
DECLARE @VOCUHERKEYY as uniqueidentifier = (SELECt top 1 TA_VoucherGuid FROM TBT_AppTransMain WHERE TA_Key = @TRANSKEYY)
Delete from TBT_Voucher_Detail WHERE VD_ParentKey =@VOCUHERKEYY
Delete from tbt_voucher WHERE VM_Key = @VOCUHERKEYY

DELETE FROM TBT_AppTransMain WHERE TA_KEY =@TRANSKEYY
DELETE FROM TBT_AppTransDetails WHERE TD_ParentKey = @TRANSKEYY

INSERT INTO TBT_Voucher 
(VM_Key,VM_ID,VM_Period,VM_Type,VM_Date,VM_Description,VM_Posted,VM_Freezed,VM_From_To,VM_TotalAmount,VM_TotalAmount_BC1,VM_TotalAmount_BC2,VM_RefNo,VM_Currency)
VALUES(@VOUCHERKEY,@VoucherID,@PERIOD,@VoucherType,@VoucherDATE,@VoucherDesc,1,0,'From App',${TotalAmount},${TotalAmount},${TotalAmount} * @CurrencyRateBC2,@ref,@Currency)



INSERT INTO TBT_Voucher_Detail
(VD_Key,VD_ParentKey,VD_LineNumber,VD_Currency,VD_BC1_Rate,VD_BC2_Rate
,VD_Ledger,VD_Sub_Account,VD_Dr,VD_Cr,VD_Equiv_BC1,VD_Equiv_BC2)
VALUES(NEWID(),@VOUCHERKEY,0,@Currency,@CurrencyRateBC1,@CurrencyRateBC2,@DebitLedger,
@SubAccount,@amount,0,@amount,@amount * @CurrencyRateBC2)

INSERT INTO TBT_Voucher_Detail
(VD_Key,VD_ParentKey,VD_LineNumber,VD_Currency,VD_BC1_Rate,VD_BC2_Rate
,VD_Ledger,VD_Sub_Account,VD_Dr,VD_Cr,VD_Equiv_BC1,VD_Equiv_BC2)
VALUES(NEWID(),@VOUCHERKEY,1,@Currency,@CurrencyRateBC1,@CurrencyRateBC2,@CreditLedger,
@SubAccount,0,@amount,@amount,@amount * @CurrencyRateBC2)




INSERT INTO TBT_AppTransMain
(TA_Key,TA_ID,TA_RefNo,TA_Date,TA_Description,TA_Period,TA_Type,TA_VoucherGuid)
VALUES(@TRANSKEY,@VoucherID,@ref,@VoucherDATE,@VoucherDesc,@PERIOD,@TYPE,@VOUCHERKEY)

INSERT INTO TBT_AppTransDetails
(TD_Key,TD_ParentKey,TD_CatorgoryGuid,TD_Amount,TD_TaxAmount,TD_ChargeAmount,TD_SubAccount
,TD_MethodSubAccount,TD_PaymentType,TD_VatType)
VALUES(NEWID(),@TRANSKEY,@CATEGORY,@amount,@taxAmount,
@chargeAmount,@SUBACCOUNT,@OTHERSUBACCOUNT,@PAYMENTTYPE,@taxType)




COMMIT
END TRY
BEGIN CATCH
  IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION --RollBack in case of Error
    DECLARE @ErrorMessage NVARCHAR(4000);  
    DECLARE @ErrorSeverity INT;  
    DECLARE @ErrorState INT;  

    SELECT   
       @ErrorMessage = ERROR_MESSAGE(),  
       @ErrorSeverity = ERROR_SEVERITY(),  
       @ErrorState = ERROR_STATE();  

    RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState); 

END CATCH


   `
   console.log(query);
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
    const query = `   BEGIN TRY
    BEGIN TRANSACTION 
    DECLARE @TRANSKEYY as uniqueidentifier  = '${id}'
    DECLARE @VOCUHERKEYY as uniqueidentifier = (SELECt top 1 TA_VoucherGuid FROM TBT_AppTransMain WHERE TA_Key = @TRANSKEYY)
    Delete from TBT_Voucher_Detail WHERE VD_ParentKey =@VOCUHERKEYY
    Delete from tbt_voucher WHERE VM_Key = @VOCUHERKEYY
    
    DELETE FROM TBT_AppTransMain WHERE TA_KEY =@TRANSKEYY
    DELETE FROM TBT_AppTransDetails WHERE TD_ParentKey = @TRANSKEYY
    
    COMMIT
    END TRY
    BEGIN CATCH
      IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION --RollBack in case of Error
        DECLARE @ErrorMessage NVARCHAR(4000);
        DECLARE @ErrorSeverity INT;
        DECLARE @ErrorState INT;
    
        SELECT
           @ErrorMessage = ERROR_MESSAGE(),
           @ErrorSeverity = ERROR_SEVERITY(),
           @ErrorState = ERROR_STATE();
    
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    
    END CATCH
    `
    const result = await sql.query(query); 
    res.send( JSON.parse(JSON.stringify(result))); 
} catch (err) {
  console.log(err);
  res.send(err);
}
};


