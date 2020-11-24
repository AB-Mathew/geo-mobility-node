/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || "8000";
/**
 *  App Configuration
 */

 app.set('views', path.join(__dirname, 'views'));
 app.set('view engine', 'pug');

 app.use(express.static('public'));

/**
 * Routes Definitions
 */
// app.get("/", (req, res) => {
//     res.status(200).send("Rogers Geo");
// });

app.get("/", (req, res) => {
    res.render('login');
});
app.get("/geomarker", (req, res) => {
    res.render('geomarker', {
        path: req.path
    });
});
app.get("/workflows", (req, res) => {
    res.render('workflows',{
        path: req.path
    });
});
app.get("/dashboard", (req, res) => {
    res.render('dashboard', {
        path: req.path
    });
});


//Temporary until auth is setup
app.post("/loggedin", (req, res) => {
    res.redirect('/geomarker');
});
/**
 * Server Activation
 */
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});