const Sequelize = require(`sequelize`);
const dao = require(`../database_access_object`);
const logger = require(`../../logger`);

class StoryStats extends Sequelize.Model {
}

StoryStats.init({
    id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    statstring: {
        type: Sequelize.STRING(2000),
        allowNull: false
    }
    // id: {
    //     type: Sequelize.BIGINT,
    //     allowNull: false
    // },
    // userId: {
    //     type: Sequelize.BIGINT,
    //     allowNull: false
    // }
}, {
    sequelize: dao,
    modelName: `story_stats`
});

module.exports = StoryStats;