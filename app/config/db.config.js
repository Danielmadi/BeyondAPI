//const sql = require('mssql');

const SQLCONN =  () =>{
 
//   console.log('tetstsets');
//   // await sql.connect('Server=192.168.1.147,1433;Database=BeyondDataNew;User Id=sa;Password=P@ssw0rd;Encrypt=false')
//     await sql.connect('Server=aa15pm8bn3sx004.cstvrifq4sia.us-west-2.rds.amazonaws.com,1433;Database=Database;User Id=SCSAdmin;Password=Silicon$$Silicon;Encrypt=false')

//  // await sql.connect('Server=192.168.1.147,1433;Database=VBACC0219;User Id=sa;Password=P@ssw0rd;Encrypt=false');
//   sql.pool =5 ;
  return "";
}


let SQLCON = "";
if(1===0){
  SQLCON = "Server=192.168.1.147,1433;Database=BeyondDataNew;User Id=sa;Password=P@ssw0rd;Encrypt=false"

}else{
  SQLCON = "Server=aa15pm8bn3sx004.cstvrifq4sia.us-west-2.rds.amazonaws.com,1433;Database=Database;User Id=SCSAdmin;Password=Silicon$$Silicon;Encrypt=false"
}

module.exports = SQLCON;