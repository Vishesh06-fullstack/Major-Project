// require('dotenv').config();

require('dotenv').config();
console.log("Raw ENV ATLASDB_URL:", process.env.ATLASDB_URL);
console.log('cloud key' ,process.env.CLOUD_API_SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError.js')
const ejsMate = require("ejs-mate");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

// Authentication part
const passport = require('passport');
const LocalStratergy = require("passport-local");
const User = require('./models/user.js')
// 
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js")
const userRouter = require('./routes/user.js')

const dbURL = process.env.ATLASDB_URL;

main().then(() => {
    console.log("Database succesfully connect");
}).catch((err) => {
    console.log("Database connection failed " + err);
})
async function main() {
    await mongoose.connect(dbURL);
}

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs' , ejsMate);
app.use(express.static(path.join(__dirname , "/public")));

const store = MongoStore.create({
    mongoUrl : dbURL,
    crypto : {
        secret : process.env.SECRET
    },
    touchAfter : 24 * 3600,
});

store.on("error" , () => {
    console.log("ERROR IN MONGO SESSION STORE" ,err);
} )

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
};



app.use(session(sessionOptions));
app.use(flash());

// Authentication part
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// 

app.use((req , res , next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next()
})

app.get('/', (req, res) => {
  res.redirect('/listings');
});

// app.all("*" , (req , res , next) => {
//      next(new ExpressError(404 , "Page Not found!"));
// });

app.get('/demouser' , async(req , res) => {
    let fakeUser = new User({
        email : "username@gmail.com",
        username : "delta-student"
    });
    let registeredUser = await User.register(fakeUser , "helloworld" )
    res.send(registeredUser);
})

app.use("/listings" , listingsRouter);
app.use('/listings/:id/reviews' , reviewsRouter);
app.use('/' , userRouter);

app.use((err , req , res , next) => {
    let {statusCode = 500 , message = "something went wrong!"} = err;
    res.status(statusCode).render('error.ejs' , {message});
})
app.listen(port , () => {
    console.log(`app is running at ${port}`);
})

