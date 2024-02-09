const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); // Import the cors middleware

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost', // Replace with your frontend's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// mysql connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test_nodejs',
    port: '3306'
});

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to Mysql database = ', err);
        return;
    }
    console.log('Mysql successfully connected!');
});

//Create Router
app.post("/api/user/create",async (req,res) => {
    const {email , name , password} = req.body

    try{
        connection.query(
            "INSERT INTO users(email, fullname, password) VALUES(?, ?, ?)",
            [email , name , password],
            (err, results, fields) => {
                if(err){
                    console.log('Error while user into' ,err);
                    return res.status(400).send();
                }
                return res.status(201).json({Message: "new user succesfully"})
            } 
        )
    } catch(err){
        console.log(err);
        return res.status(500).send();
    }
})

//READ
app.get("/api/user", async (req, res) =>{
    try{
        connection.query("SELECT * FROM users",(err, results, fields) =>{
            if(err){
                console.log(err);
                return res.status(400).send();
            }
            res.status(200).json(results);
        })
    } catch(err){
        console.log(err);
        return res.status(500).send();
    }
})

//read email users from db

app.get("/api/user/:email", async (req, res) =>{
    const email = req.params.email;
    try{
        connection.query("SELECT * FROM users WHERE email= ? ",[email],(err, results, fields) =>{
            if(err){
                console.log(err);
                return res.status(400).send();
            }
            res.status(200).json(results);
        })
    } catch(err){
        console.log(err);
        return res.status(500).send();
    }
})


//update data 
app.patch("/api/update/:email", async (req , res)  =>{
    const email = req.params.email;
    const newpassword = req.body.newpassword;

    try{
        connection.query("UPDATE users SET password = ? WHERE email =?  ",[newpassword,email],(err, results, fields) =>{
            if(err){
                console.log(err);
                return res.status(400).send();
            }
            res.status(200).json({message : "USer password Updated successfully"});
        })
    } catch(err){
        console.log(err);
        return res.status(500).send();
    }

    
})

//DELETE 
app.delete("/api/user/delete/:email", async(req , res) =>{
    const email = req.params.email;

    try{
        connection.query("DELETE FROM users WHERE email = ?",[email],(err, results, fields) =>{
            if(err){
                console.log(err);
                return res.status(400).send();
            }
           if(results.affectedRows === 0 ){
           return res.status(404).json({message : "No user with that email!"});
           }
           return res.status(200).json({message : "user deleted Successfully"});
        })
    } catch(err){
        console.log(err);
        return res.status(500).send();
    }
})

app.listen(3000, () => console.log('Server is running on port 3000'));