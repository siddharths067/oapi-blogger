const Sequelize = require(`sequelize`);
const logger = require(`../logger`);

const DAO = new Sequelize(`mysql`, `root`, `password`, {
    host: `db`,
    dialect: `mysql`,
    port: 3306
});

DAO.sync().then(() => {
    logger.info(`Connection established to MySQL Server Correctly`);
}).catch(err => {
    logger.error(`Cannot connect to SQL Server`);
    logger.error(err);
    logger.error(`Exiting due to error, container should restart`);
    process.exit(1);
});


module.exports = DAO;