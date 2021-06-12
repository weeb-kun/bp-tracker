const express = require("express");
const exphbs = require("express-handlebars");
const {allowInsecurePrototypeAccess} = require("@handlebars/allow-prototype-access");
const handlebars = require("handlebars");
const db = require("./db"),
Reading = require("./models/Reading");
const bcrypt = require("bcryptjs");
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

app.use((req, res, next) => {
    if(req.session.loggedIn) next();
    else res.redirect("/login");
});

app.get("/", (req, res) => {
    Reading.findAll().then(readings => {
        res.render("home", {
            title: "home",
            reading: readings,
            loggedIn: req.session.loggedIn
        });
    });
});

app.route("/record")
    .get((req, res) => {
        res.render("add", {
            title: "record reading",
            loggedIn: req.session.loggedIn
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

app.route("/login")
.get((req, res) => res.render("login", {title: "login", loggedIn: req.session.loggedIn}))
.post((req, res) => {
    bcrypt.compare(req.body.password, process.env.password)
    .then(match => {
        if(match) {
            req.session.loggedIn = true;
            req.session.username = "weeb";
            res.redirect("/");
        } else {
            res.redirect("/login");
        }
    });
});

app.listen(process.env.PORT, () => {
    process.env.NODE_ENV = "production";
    console.log("server running on port 5000");
});