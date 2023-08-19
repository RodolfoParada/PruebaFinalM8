const db = require('../models')
const User = db.users


const Verificando = async (email) => {
    try {
        const existingEmail = await User.findOne({
            where: {
                email
            }
        });
        return !!existingEmail;
    } catch (error) {

        throw error;
    }
}
module.exports = Verificando;