const Sequelize = require(`sequelize`);
const dao = require(`../database_access_object`);

class Story extends Sequelize.Model {
}

Story.init({
    id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING(2000),
        allowNull: false,
    },
    content: {
        type: Sequelize.STRING(10000),
        allowNull: false,
    }
}, {
    sequelize: dao,
    modelName: `stories`
});

module.exports = Story;