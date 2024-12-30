// Create web server
// npm install express
// npm install body-parser
// npm install mongoose
// npm install ejs
// npm install method-override
// npm install express-sanitizer
// npm install passport
// npm install passport-local
// npm install passport-local-mongoose
// npm install express-session
// npm install connect-flash
// npm install express-validator
// npm install express-moment
// npm install moment

var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    expressValidator = require("express-validator"),
    expressSession = require("express-session"),
    moment = require("moment"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

var commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost:27017/comments", { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(expressValidator());
app.locals.moment = require("moment");
// seedDB();

// Passport configuration
app.use(expressSession({
    secret: "This is a secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/comments", commentRoutes);

app.listen(3000, function() {
    console.log("Server started on port 3000");
});