const sql = require('mssql');

const SQL = async () =>{
  await sql.connect('Server=192.168.1.147,1433;Database=VBACC0219;User Id=sa;Password=P@ssw0rd;Encrypt=false');
  return sql;
}




module.exports = sql;