const sql = require('mssql');
const  SQLCON = require('../config/db.config');

var passwordHasher = require('aspnet-identity-pw');
// users hardcoded for simplicity, store in a db for production applications
//const users = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];

module.exports = {
    authenticate,
  //  getAll
};


async function authenticate({ username, password }) {
 
  const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
    console.log(password);
  //  const user = users.find(u => u.username === username && u.password === password);
    await sql.connect(SQLCON)
    // await sql.connect('Server=aa15pm8bn3sx004.cstvrifq4sia.us-west-2.rds.amazonaws.com,1433;Database=Database;User Id=SCSAdmin;Password=Silicon$$Silicon;Encrypt=false')
 sql.pool =5 ;
     const query = `
      select Email,PasswordHash from AspNetUsers WHERE Email = '${username.toString()}'`
     //  OFFSET  ${parseInt(skip)} ROWS
     //  FETCH NEXT  ${parseInt(take)} ROWS ONLY`;
 
     const user = await sql.query(query);
     //console.log(user.recordset[0].PasswordHash);
     if (user.recordset.length > 0) {
     
    
     

console.log('daniel');
var isValid = passwordHasher.validatePassword(password, user.recordset[0].PasswordHash);
  console.log(user.recordset[0].PasswordHash);
    if(isValid){
        const { PasswordHash, ...userWithoutPassword } = user.recordset;
        return userWithoutPassword;
    }
        
    }
}

