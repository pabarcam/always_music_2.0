const { Pool } = require('pg')

const config = {
  user: 'paulo', 
  password: 'password',
  host: 'localhost',
  database:'students',
  port:5432
}

const pool = new Pool(config)

module.exports = {
  getClient: ()=> pool.connect(), 
  end: ()=> pool.end()
}