const {Sequelize} = require("sequelize");

module.exports = new Sequelize(process.env.CLEARDB_DATABASE_URL, {
    dialect: "mysql",
    timezone: "+08:00",
    define: {
        timestamps: false,
        freezeTableName: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});