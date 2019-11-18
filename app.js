const express = require('express');
const mysql = require('mysql');
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

// routes
app.get("/", async function(req, res) {

    let categories = await getCategories();
    let lastName = await getLastNames();
    let gender = await getGenders();
   res.render("index", {"categories": categories, "lastName": lastName, "gender": gender});
}); // root

app.get("/quotes", async function(req, res) {
    let rows = await getQuotes(req.query);
    res.render("quotes", {records: rows});
}); // quotes

function getQuotes(query) {
    let keyword = query.keyword;
    let category = query.category;
    let lastName = query.lastName;
    let gender = query.gender;

    let conn = dbConnection();

    return new Promise(function(resolve, reject) {
        conn.connect(function(err) {
            if(err) throw err;
            console.log("Connected!");

            let sql = `SELECT quote, firstName, lastName 
                       FROM l9_quotes 
                       NATURAL JOIN l9_author 
                       WHERE quote LIKE '%${keyword}%'`;

            if (category) { // if the user selected a quote category
                sql = `SELECT quote, firstName, lastName, category
                       FROM l9_quotes
                       NATURAL JOIN l9_author
                       WHERE category = '${category}'`;
            }

            if(lastName) { // if the user selected an author's name
                sql = `SELECT quote, firstName, lastName
                       FROM l9_quotes
                       NATURAL JOIN l9_author
                       WHERE firstName = '${firstName}' 
                       AND lastName = '${lastName}'`; // need to get full name
            }

            if (gender) { // if the user selected an author's gender
                sql = `SELECT quote, firstName, lastName, sex
                       FROM l9_quotes q
                       NATURAL JOIN l9_author a
                       WHERE sex = '${gender}'`;
            }

            conn.query(sql, function(err, rows, fields) {
                if(err) throw err;
                resolve(rows);
            });
        }); // connect
    }); // promise
} // getQuotes

function getCategories() {

    let conn = dbConnection();

    return new Promise(function(resolve, reject) {
        conn.connect(function(err) {
            if(err) throw err;
            console.log("Connected!");

            let sql = `SELECT DISTINCT category 
                       FROM l9_quotes
                       ORDER BY category`;

            conn.query(sql, function(err, rows, fields) {
                if(err) throw err;
                resolve(rows);
            });
        }); // connect
    }); // promise
} // getCategories

function getLastNames() {

    let conn = dbConnection();

    return new Promise(function(resolve, reject) {
        conn.connect(function(err) {
            if(err) throw err;
            console.log("Connected!");

            let sql = `SELECT DISTINCT lastName 
                       FROM l9_author
                       ORDER BY lastName`;

            conn.query(sql, function(err, rows, fields) {
                if(err) throw err;
                resolve(rows);
            });
        }); // connect
    }); // promise
} // getCategories

function getGenders() {

    let conn = dbConnection();

    return new Promise(function(resolve, reject) {
        conn.connect(function(err) {
            if(err) throw err;
            console.log("Connected!");

            let sql = `SELECT DISTINCT gender 
                       FROM l9_gender
                       ORDER BY gender`;

            conn.query(sql, function(err, rows, fields) {
                if(err) throw err;
                resolve(rows);
            });
        }); // connect
    }); // promise
} // getCategories

app.get("/dbTest", function(req, res) {

    let conn = dbConnection();

    conn.connect(function(err) {
        if(err) throw err;
        console.log("Connected!");

        let sql = "SELECT * FROM l9_author";

        conn.query(sql, function(err, rows, fields) {
            if(err) throw err;
            res.send(rows);
        });
    });
}); // dbTest

// db Connection
function dbConnection() {
    let conn = mysql.createConnection({
        host: "if0ck476y7axojpg.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
        user: "vj509zbztccrawn8",
        password: "cb3j3wge6ncy5pxp",
        database: "r2rnsd5qlpobjp9s"
    });
    return conn;
};

// starting server
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Express server is running...");
});