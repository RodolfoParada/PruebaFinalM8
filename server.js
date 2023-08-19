// Importar el módulo express para crear la aplicación
const express = require('express')

// Crear una instancia de la aplicación express
const app = express()

// Importar el módulo cors para manejar los encabezados CORS en las solicitudes
const cors = require('cors')

//Definir el número de puerto en el que se ejecutará el servidor
const port = 3010

// Importar el objeto de base de datos y modelos definidos en la carpeta "models"
const db = require('./app/models')

// Importar las rutas definidas en los archivos "user.routes.js" y "bootcamp.routes.js"
const userRoutes = require('./app/routes/user.routes.js')
const bootcampRoutes = require('./app/routes/bootcamp.routes.js')


app.use(express.json())


app.use(cors({
   
}))


app.listen(port, async () => {
    await db.sequelize.sync()
    console.log("Servidor ejecutando Puerto: " + port);
})


app.use(userRoutes)
app.use(bootcampRoutes)


