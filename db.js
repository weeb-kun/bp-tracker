const {Sequelize} = require("sequelize");

module.exports = new Sequelize("bp", "bp", process.env.bp, {
    host: "localhost",
    dialect: "mysql",
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