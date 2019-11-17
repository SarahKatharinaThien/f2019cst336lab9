const express = require('express');
const mysql = require('mysql');
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

// routes
app.get("/", function(req, res) {
   res.render("index");
}); // root

app.get("/quotes", async function(req, res) {
    let rows = await getQuotes(req.query);
    res.render("quotes", {records: rows});
}); // quotes

function getQuotes(query) {
    let keyword = query.keyword;

    let conn = dbConnection();

    return new Promise(function(resolve, reject) {
        conn.connect(function(err) {
            if(err) throw err;
            console.log("Connected!");

            let sql = `SELECT quote, lastName, category 
                   FROM l9_quotes 
                   NATURAL JOIN l9_author 
                   WHERE quote LIKE '%${keyword}%'`;

            conn.query(sql, function(err, rows, fields) {
                if(err) throw err;
                resolve(rows);
            });
        }); // connect
    }); // promise
} // getQuotes

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