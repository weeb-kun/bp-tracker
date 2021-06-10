const express = require("express");
const exphbs = require("express-handlebars");
const {allowInsecurePrototypeAccess} = require("@handlebars/allow-prototype-access");
const handlebars = require("handlebars");
const db = require("./db"),
Reading = require("./models/Reading");
const app = express();

app.engine("handlebars", exphbs({
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(handlebars),
    helpers: {
        formatDate: date => {
            var newDate = new Date(date);
            return `${newDate.getDate()} ${months[newDate.getMonth()]} ${newDate.getFullYear()}`;
        }
    }
}));

const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
]

app.set("view engine", "handlebars");
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

// authenticate to db and sync
db.authenticate().then(() => db.sync({alter: true})).catch(err => console.error(err));

app.get("/", (req, res) => {
    Reading.findAll().then(readings => {
        res.render("home", {
            title: "home",
            reading: readings
        });
    });
});

app.route("/record")
    .get((req, res) => {
        res.render("add", {
            title: "record reading"
        });
    })
    .post((req, res) => {
        var date = new Date();
        Reading.create({
            date: req.body.date ? req.body.date : `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
            time: req.body.time ? req.body.time : "00:00",
            systolic: req.body.sys,
            diastolic: req.body.dia,
            pulse_rate: req.body.pr
        }).then(reading => {
            res.redirect("/");
        })
    });

app.listen(5000, () => {
    process.env.NODE_ENV = "production";
    console.log("server running on port 5000");
});