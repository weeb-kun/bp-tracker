const express = require("express");
const exphbs = require("express-handlebars");
const db = require("./db"),
Reading = require("./models/Reading");
const app = express();

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));

app.set("view engine", "handlebars");
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

// authenticate to db and sync
db.authenticate().then(() => db.sync({alter: true})).catch(err => console.error(err));

app.get("/", (req, res) => {
    res.render("home", {
        reading: Reading.findAll()
    });
});

app.route("/record")
    .get((req, res) => {
        res.render("add");
    })
    .post((req, res) => {

    });

app.listen(5000, () => {
    console.log("server running on port 5000");
});