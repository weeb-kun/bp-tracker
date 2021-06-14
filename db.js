const {Sequelize} = require("sequelize");

module.exports = new Sequelize(process.env.CLEARDB_DATABASE_URL, {
    //host: "eu-cdbr-west-01.cleardb.com",
    dialect: "mysql",
    timezone: "+08:00",
    define: {
        timestamps: false,
        freezeTableName: true
    },
    dialectOptions: {
        useUTC: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});