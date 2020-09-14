const Sequelize = require(`sequelize`);
const dao = require(`../database_access_object`);

class User extends Sequelize.Model {}

User.init({
    id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING(200),
        allowNull: false
    }
}, {
    sequelize: dao,
    modelName: `users`
});

module.exports = User;