const {
    users
} = require('../models')
const db = require('../models')
const User = db.users
const Bootcamp = db.bootcamps

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const {
    secretKey
} = require('../config/auth.config');

exports.createUser = (user) => {
    return User.create({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: bcrypt.hashSync(user.password, 10)
        })
        .then(user => {
            console.log(`Se ha creado el usuario: ${JSON.stringify(user, null, 4)}`)
            return user
        })
        .catch(err => {
            console.log(`No se puede crear el usuario ${err}`)
        })
}
exports.findUserById = (userId) => {
    return User.findByPk(userId, {
            include: [{
                model: Bootcamp,
                as: "bootcamps",
                attributes: ["id", "title"],
                through: {
                    attributes: [],
                }
            }, ],
        })
        .then(users => {
            return users
        })
        .catch(err => {
            console.log(`No encuentra a los usuarios: ${err}`)
        })
}
exports.findAll = () => {
    return User.findAll({
        include: [{
            model: Bootcamp,
            as: "bootcamps",
            attributes: ["id", "title"],
            through: {
                attributes: [],
            }
        }, ],
    }).then(users => {
        return users
    })
}

exports.updateUserById = (userId, fName, lName) => {
    return User.update({
            firstName: fName,
            lastName: lName
        }, {
            where: {
                id: userId
            }
        })
        .then(user => {
            console.log(`Se ha actualizado el usuario: ${JSON.stringify(user, null, 4)}`)
            return user
        })
        .catch(err => {
            console.log(`NO actualizaba el usuario: ${err}`)
        })
}
exports.deleteUserById = (userId) => {
    return User.destroy({
            where: {
                id: userId
            }
        })
        .then(user => {
            console.log(`Se ha eliminado el usuario: ${JSON.stringify(user, null, 4)}`)
            return user
        })
        .catch(err => {
            console.log(`NO se puede eliminar el usuario: ${err}`)
        })
}

exports.loginUser = async (userData) => {
    const {
        email,
        password
    } = userData;
    const wantedUser = await User.findOne({
        where: {
            email: email
        }
    });
    if (!wantedUser) {
        throw 'Usuario no esta registrado'
    } else {
        const passwordMatch = bcrypt.compareSync(password, wantedUser.password)
        if (!passwordMatch) {
            throw 'Usuario y / o contraseña incorrectos'
        }
    }
    const accessToken = jwt.sign({
        userId: wantedUser.id
    }, secretKey, {
        expiresIn: '1h'
    });
    const objectUser = {
        id: wantedUser.id,
        firstName: wantedUser.firstName,
        lastName: wantedUser.lastName,
        email: wantedUser.email,
        accessToken: accessToken
    }
    return objectUser;
}