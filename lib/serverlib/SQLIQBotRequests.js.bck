const sql = require('mssql')
 
 const config = {
    user: 'iqbot',
    password: 'Un1ver$e',
    server: 'localhost\\SQLEXPRESS', // You can use 'localhost\\instance' to connect to named instance
    database: 'FileManager',
 
    options: {
        encrypt: false // Use this if you're on Windows Azure
    }
}

// Listeners
    socket.on('get_sql', function(){test()});

// Functions
 function test(){
    try {
        let pool = await sql.connect(config)
        let result1 = await pool.request()
            .input('LIid', sql.Int, '8c554e14-8e1f-437e-aeec-8f363627eb6f')
            .query('select * from FileDetails where id = @LIid')
            
        console.dir(result1)
    
 }


(async function () {
    try {
        let pool = await sql.connect(config)
        let result1 = await pool.request()
            .input('input_parameter', sql.Int, value)
            .query('select * from mytable where id = @input_parameter')
            
        console.dir(result1)
    
        // Stored procedure
        
        let result2 = await pool.request()
            .input('input_parameter', sql.Int, value)
            .output('output_parameter', sql.VarChar(50))
            .execute('procedure_name')
        
        console.dir(result2)
    } catch (err) {
        // ... error checks
    }
})()
 
sql.on('error', err => {
    // ... error handler
})