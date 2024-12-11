const mysql = require('mysql2')

// create a new connection to pool server
const pool = mysql.createPool({
    host: '192.168.34.68',
    user: 'root', //
    password: 'HaUINumber1',
    database: 'shopDEV'
})

const batchSize = 100000; // batch size
const totalSize = 1_000_000; // total size

let currentId = 1;
console.time('::::::TIMER:::')
const insertBatch = async () => {
    const values = []
    for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
        const name = `name-${currentId}`
        const age = currentId % 100 + 1
        const address = `address-${currentId}`
        values.push([currentId, name, age, address])
        currentId++;
    }

    if(!values.length) {
        console.timeEnd('::::::TIMER:::')
        pool.end(err => {
            if(err) {
                console.error('Error occur when running mysql pool:', err)
            } else {
                console.log('connection pool closed successfully');
                
            }
        })
        return
    }
    const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`
    pool.query(sql, [values], async (err, result) => {
        if(err) throw err
        console.log(`Inserted ${result.affectedRows} records`);
        await insertBatch()
    })
}

insertBatch().catch(console.error)