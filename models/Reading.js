const sequelize = require("sequelize");
const db = require("../db");

module.exports = db.define("reading", {
    id: {type: sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    date: {type: sequelize.DATEONLY},
    time: {type: sequelize.TIME},
    systolic: {type: sequelize.INTEGER},
    diastolic: {type: sequelize.INTEGER},
    pulse_rate: {type: sequelize.INTEGER}
});