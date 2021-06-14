const express = require("express");
const exphbs = require("express-handlebars");
const {allowInsecurePrototypeAccess} = require("@handlebars/allow-prototype-access");
const handlebars = require("handlebars");
const db = require("./db"),
Reading = require("./models/Reading");
const bcrypt = require("bcryptjs");
const session = require("express-session");
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
app.use(session({
    key: "bp",
    secret: "bp",
    saveUninitialized: false
}));

// authenticate to db and sync
db.authenticate().then(() => db.sync({alter: true})).catch(err => console.error(err));

app.use("/bp", (req, res, next) => {
    if(req.session.loggedIn) next();
    else res.redirect("/login");
});

app.get("/", (req, res) => res.redirect("/bp"));

app.get("/bp", (req, res) => {
    Reading.findAll().then(readings => {
        res.render("home", {
            title: "home",
            reading: readings,
            loggedIn: req.session.loggedIn
        });
    });
});

app.route("/bp/record")
    .get((req, res) => {
        res.render("add", {
            title: "record reading",
            loggedIn: req.session.loggedIn
        });
    })
    .post((req, res) => {
        var date = new Date();
        Reading.create({
            date: req.body.date != "" ? req.body.date : `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
            time: req.body.time != "" ? req.body.time : `${date.getHours()}:${date.getMinutes()}`,
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

app.get("/logout", (req, res) => {
    req.session.destroy((err => {
        if(err) res.send(err);
        else res.redirect("/");
    }));
});

app.listen(process.env.PORT | 5000, () => {
    process.env.NODE_ENV = "production";
    console.log(`server running on port ${process.env.PORT}`);
});