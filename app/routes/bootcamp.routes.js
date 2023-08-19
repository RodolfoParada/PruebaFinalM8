const express = require('express')
const {
    Router
} = express
const router = Router()
const bootcampController = require('./../controllers/bootcamp.controller')
const userController = require('../controllers/user.controller')
const comprobar = require('./../middleware/index')

router.post('/api/bootcamp', comprobar.tokenActivo, async (request, response) => {
    try {
        if (!request.body.title) {
            return response.status(400).json({
                success: false,
                message: 'Ingrese el title Bootcamp'
            })
        }
        if (!request.body.cue) {
            return response.status(400).json({
                success: false,
                message: 'Ingrese Cue del Bootcamp'
            })
        }
        if (!request.body.description) {
            return response.status(400).json({
                success: false,
                message: 'Ingrese la Description del Bootcamp'
            })
        }

        const bootcamp = await bootcampController.createBootcamp(request.body)
        return response.json({
            success: true,
            data: bootcamp
        })


    } catch (error) {
        return response.status(500).json({
            success: false,
            message: 'Error en el servidor',
            data: error
        })
    }
})

router.post('/api/bootcamp/addUser', comprobar.tokenActivo, async (request, response) => {
    try {
        const userId = Number(request.userId);
        const bootcampId = Number(request.body.bootcampId);

        const userBootcamps = await userController.findUserById(userId);

        const isUserInBootcamp = userBootcamps.bootcamps.some(bootcamp => bootcamp.id === bootcampId);

        if (isUserInBootcamp) {
            return response.status(400).json({
                success: false,
                message: 'El usuario ya está inscrito en el bootcamp'
            });
        }
        const bootcamp = await bootcampController.findById(bootcampId);
        if (!bootcamp) {
            return response.status(404).json({
                success: false,
                message: 'Bootcamp no encontrado'
            });
        }
        const result = await bootcampController.addUser(bootcampId, userId);
        if (!result) {
            return response.status(500).json({
                success: false,
                message: 'Error al agregar usuario al bootcamp'
            });
        }
        return response.json({
            success: true,
            message: 'Usuario agregado exitosamente al bootcamp'
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
});

router.get('/api/bootcamp/:id', comprobar.tokenActivo, async (request, response) => {
    try {
        const bootcampId = Number(request.params.id);
        const bootcampWithUsers = await bootcampController.findById(bootcampId);


        if (!bootcampWithUsers) {
            return response.status(404).json({
                success: false,
                message: 'Bootcamp no encontrado'
            });
        }
        return response.json({
            success: true,
            data: bootcampWithUsers
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
});

router.get('/api/bootcamp', async (request, response) => {
    try {
        const bootcamps = await bootcampController.findAll();

        const filteredBootcamps = bootcamps.map(bootcamp => {
            return {
                id: bootcamp.id,
                title: bootcamp.title,
                cue: bootcamp.cue,
                description: bootcamp.description,
                createdAt: bootcamp.createdAt,
                updatedAt: bootcamp.updatedAt
            };
        });

        return response.json({
            success: true,
            data: filteredBootcamps
        });
    } catch (error) {

        return response.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
});

module.exports = router;