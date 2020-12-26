const yargs = require('yargs')
const db = require('./db')

const createAndEditArgs = {
  nombre: {
    describe: 'Nombre del nuevo estudiate',
    demand: true,
    alias: 'n'
  },
  rut: {
    describe:'Identificación única del estudiante',
    demand: true,
    alias: 'r'
  },
  curso: {
    describe:'Curso del estudiante',
    demand: true,
    alias: 'c'
  },
  nivel: {
    describe: 'Nivel del estudiante',
    demand: true,
    alias: 'l'
  }
};
(async () =>  {
  let client

  try {
    client = await db.getClient();
  } catch (error) {
    console.log('Error en la conexion', error.stack);
  }

const argv = yargs.command('nuevo', 'Comando para agregar un nuevo estudiante',createAndEditArgs,
  async(args) =>{
    const queryObject = {
      text:'INSERT INTO students (name, rut, course, level) VALUES ($1, $2, $3, $4) RETURNING  *', 
      values:[args.nombre, args.rut, args.curso, args.nivel]
    }
    const results = await client.query(queryObject) 

    client.release()                                          
    db.end()                                                   
    console.log(results.rows[0])
  }    
)// consulta
.command('consulta', 'muestra todos los estudiantes', async ()=>{ 
  const results = await client.query('SELECT * FROM students')

  client.release();                                           
  db.end();                                                   
  console.log(results.rows)
})//actualizar
.command('editar', 'actualiza el estudiante',createAndEditArgs,async(args) =>{
  const queryEdit = {
    text: 'UPDATE students set name=$1, course=$3, level=$4 where rut =$2  RETURNING *',
    values: [args.nombre, args.rut, args.curso, args.nivel], 
    name: 'update student por rut',
  }
  const results = await client.query(queryEdit) 

  client.release()                                         
  db.end()                                                
  console.log(results.rows[0])

})//consulta rut
.command('consultarut', 'consulta 1 estudiante por rut toda su informacion', {rut:createAndEditArgs.rut}, async(args)=>{     
  const results = await client.query('SELECT * FROM students WHERE rut=$1', [args.rut])
  
  client.release()
  console.log(results.rows[0])
    
})//eliminar
.command('eliminar', 'eliminar 1 estudiante por rut', {rut:createAndEditArgs.rut} , async(args)=>{ 
  const results = await client.query('DELETE FROM students WHERE rut=$1 RETURNING *', [args.rut])

  client.release()
  db.end()                 
  console.log(results.rows[0])
}).help().argv
})()