const express = require('express')

const {
    Router
} = express

const router = Router()

const userController = require('../controllers/user.controller')


const validations = require('../middleware/index')
const comprobar = require('../middleware/index')

router.post('/api/signup', async (request, response) => {

    try {
        /*
        4. Crear dentro de la carpeta config, el archivo auth.config.js que contendrá la frase secreta para la creación del token. 
        */
        if (!request.body.lastName) {
            return response.status(404).json({
                success: false,
                message: 'Apellido del Usuario'
            })
        }
        if (!request.body.email) {
            return response.status(404).json({
                success: false,
                message: 'Correo del Usuario'
            })
        } else {

            const emailIsInUse = await validations.tokenActivo(request.body.email)
            if (emailIsInUse) {
                return response.status(404).json({
                    success: false,
                    message: 'El correo esta en uso'
                })
            }
        }
        if (!request.body.password) {
            return response.status(413).json({
                success: false,
                message: 'Ingresa contraseña Correcta'
            })


        } else if (request.body.password.length < 12) {
            return response.status(409).json({
                success: false,
                message: 'El password debe tener al menos 12 caracteres'
            })
        }


        const user = await userController.createUser(request.body)


        return response.json({
            success: true,
            data: user
        })

    } catch (error) {
        return response.status(500).json({
            success: false,
            message: 'Error en el servidor',
            data: error
        })
    }
})

router.post('/api/signin', async (request, response) => {
    try {
        const token = await userController.loginUser(request.body)
        return response.json({
            success: true,
            message: 'Usuario Encontrado',
            data: token
        })
    } catch (error) {
        return response.status(404).json({
            success: false,
            message: error
        })
    }
})

router.get('/api/user/:id', comprobar.tokenActivo, async (request, response) => {
    try {
        const idUser = request.params.id

        if (Number(idUser) !== Number(request.userId)) {
            return response.status(403).json({
                success: false,
                message: 'Acceso denegado'
            });
        }
        const wantedUser = await userController.findUserById(idUser)

        if (!wantedUser) {
            return response.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        return response.json({
            success: true,
            data: wantedUser
        });

    } catch (error) {
        return response.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
});
router.get('/api/user', comprobar.tokenActivo, async (request, response) => {
    try {
        const wantedUsers = await userController.findAll()

        return response.json({
            success: true,
            message: 'Listado de Usuarios',
            data: wantedUsers
        })
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
})
router.put('/api/user/:id', comprobar.tokenActivo, async (request, response) => {
    try {
        const idUser = request.params.id
        if (Number(idUser) !== Number(request.userId)) {
            return response.status(403).json({
                success: false,
                message: 'Acceso denegado, solo puedes editar tu información'
            });
        }
        const {
            firstName,
            lastName
        } = request.body

        if ((!firstName || typeof firstName !== 'string') && (!lastName || typeof lastName !== 'string')) {
            return response.status(400).json({
                success: false,
                message: 'Debe indicar un nombre o apellido válido para actualizar'
            });
        }
        const updatedUser = await userController.updateUserById(idUser, firstName, lastName)

        if (!updatedUser) {
            return response.status(404).json({
                success: false,
                message: 'Usuario no encontrado o no pudo ser actualizado'
            });
        }

        return response.json({
            success: true,
            message: 'Usuario Actualizado',
            data: updatedUser
        });

    } catch (error) {
        return response.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
})
router.delete('/api/user/:id', comprobar.tokenActivo, async (request, response) => {
    try {
        const idUser = request.params.id

        if (Number(idUser) !== Number(request.userId)) {
            return response.status(403).json({
                success: false,
                message: 'Acceso denegado, solo puedes borrar tu información'
            });
        }

        const deletedUser = await userController.deleteUserById(idUser)

        if (!deletedUser) {
            return response.status(404).json({
                success: false,
                message: 'Usuario no encontrado o no pudo ser borrado'
            });
        }

        return response.json({
            success: true,
            message: 'Usuario Borrado',
            data: deletedUser
        });

    } catch (error) {
        return response.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
})

module.exports = router;