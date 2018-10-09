const express = require('express');
const bodyparser = require('body-parser');
const mongodb = require('mongodb').MongoClient;
const path = require('path');
let app = express();
const cors = require('cors')
var bodyParser = require('body-parser')

const config = {
    url: "mongodb://localhost:27017/",
    dbName:"test"
}


var monConn; // this variable gets a database connection



// following are the functions defined to interact with database 

let connection = new Promise((resolve, reject) => {
    mongodb.connect(config.url, { useNewUrlParser: true }, (err, dbs) => {
        if (err) { resolve("error") }
        else {
            monConn = dbs; 
            resolve("done")
        }
    })
});


//the insert function takes an object
 
let insert = async function (TT) {
    console.log("insert")
    var XX = new Promise((resolve, reject) => {
        var dbx = monConn.db(config.dbName)
        dbx.collection("itemlist").insertOne(TT, (err, res) => {
            if (err) { console.log(err); resolve(res) }
            else {
                console.log("the object has been inserted " + res)
                resolve("1")
            }
        })

    })
    var x = await XX;
    if (x == "1") { console.log("X"); return 1 }
    else { console.log("asdasd"); return -1 }

}

let view = async function () {
    var resultx;
    var getitems = new Promise((resolve, reject) => {
        var dbx = monConn.db(config.dbName)
        console.log("sss")
        dbx.collection("itemlist").find().toArray(function (err, result) {
             console.log("tt")
            if (err) throw err
            else { console.log(result);resultx = result;resolve("XXX"); }
        })
    })
    await getitems;
    return resultx;
}
let del=async function () {
    var clearDb=new Promise ((resolve,reject)=>{
        var dbx=monConn.db(config.name)
        dbx.collection("itemlist").drop(function(err,delstatus){
            if(err) throw err;
            if(delstatus){
                console.log("collection deleted")
            }
        })
    })
}




async function setup() {
    var g = await connection;
    if (g == "done") {
        app.listen(3000, () => {
            console.log("Connected ")

        })
    }
    else { console.log("error") }
   
}


// execution starts here
//middleware section
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }))
//
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'client')));
app.use(cors())


setup();


//routes

app.post("/", (req, res, next) => {
    async function insertx() {
        for (i = 0; i < req.body.length; i++) {
       
            await insert({ "name": req.body[i].prdtname, "brand": req.body[i].prdtbrand, "material": req.body[i].prdtmaterial, "price": req.body[i].prdtdtprice,"views":req.body[i].prdtviews,"link":req.body[i].prdtlink })
        }
    }
    insertx()
    res.send("OKAY")
}
)

app.get("/",(req,res,next)=>{
    res.render('chart.html')
})

app.get("/chart", (req, res, next) => {
    async function viewx(){
       res.send( await view())
    }
   viewx()
})
