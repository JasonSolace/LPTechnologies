import express from "express"
import mysql from "mysql"
import cors from "cors"


const app = express()
app.use(express.json())
app.use(cors())

//Database Connection 
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database: "blobdata"
})

//Initial Check to see if I can connect to the backend
app.get("/", (req,res)=>{
    res.json("Welcome to the backend!")
})

//Access to SQL Data points based on what ID is given to the API
app.get("/data/:id", (req, res)=>{
    const id = req.params.id;

    const q = "SELECT trace_data FROM test WHERE trace_id = " + id
    
    db.query(q,(err,data)=>{
        if(err) return res.json(err)

        const blobData = data[0].trace_data;
        
        const newIntegers = [];
        for (let i = 0; i < blobData.length; i += 4){
            newIntegers.push(blobData.readInt32BE(i) / 1000); //This cleans the data into readable integers that is pushed from the API!
        }

        res.json(newIntegers);
    })
})

//Same as above but grabs date instead
app.get("/date/:id", (req, res)=>{
    const id = req.params.id;

    const q = "SELECT trace_time FROM test WHERE trace_id = " + id
    
    db.query(q,(err,data)=>{
        if(err) return res.json(err)

        res.json(data[0]);
    })
})

//Checks for successful connection on port 8800
app.listen(8800, ()=>{
    console.log("Connected to backend")
})