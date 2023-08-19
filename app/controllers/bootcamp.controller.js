const {
    users,
    bootcamps
} = require('../models')
const db = require('../models')
const Bootcamp = db.bootcamps
const User = db.users

exports.createBootcamp = (bootcamp) => {
    return Bootcamp.create({
            title: bootcamp.title,
            cue: bootcamp.cue,
            description: bootcamp.description,
        })
        .then(bootcamp => {
            console.log(`Creado el bootcamp: ${JSON.stringify(bootcamp, null, 4)}`)
            return bootcamp
        })
        .catch(err => {
            console.log(`Error al crear el bootcamp: ${err}`)
        })
}

exports.addUser = (bootcampId, userId) => {
    return Bootcamp.findByPk(bootcampId)
        .then((bootcamp) => {
            if (!bootcamp) {
                console.log("No se encontro el Bootcamp!");
                return null;
            }
            return User.findByPk(userId).then((user) => {
                if (!user) {
                    console.log("Usuario no encontrado!");
                    return null;
                }
                bootcamp.addUser(user);
                console.log(`Agregado el usuario id=${user.id} al bootcamp con id=${bootcamp.id}`);
                return bootcamp;
            });
        })
        .catch((err) => {
            console.log("No se puede agregar al Usuario al Bootcamp", err);
        });
};

exports.findById = (Id) => {
    return Bootcamp.findByPk(Id, {
            include: [{
                model: User,
                as: "users",
                attributes: ["id", "firstName", "lastName"],
                through: {
                    attributes: [],
                }
            }, ],
        })
        .then(bootcamp => {
            return bootcamp
        })
        .catch(err => {
            console.log(`No se encontra el bootcamp: ${err}`)
        })
}

exports.findAll = () => {
    return Bootcamp.findAll({
        include: [{
            model: User,
            as: "users",
            attributes: ["id", "firstName", "lastName"],
            through: {
                attributes: [],
            }
        }, ],
    }).then(bootcamps => {
        return bootcamps
    }).catch((err) => {
        console.log("No encuentra el  Bootcamps: ", err);
    });
}