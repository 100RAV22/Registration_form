const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

main().then(()=>{
    console.log("Connection Successfull");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/RegFormDB');
};

const registerSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
});

const Registration = mongoose.model("Registration",registerSchema);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/pages/index.html");
    
});

app.post("/register",async (req,res)=>{
    try{
        const {name, email, password} = req.body;
        const existingUser = await Registration.findOne({email:email});
        if(!existingUser){
             const registrationData = new Registration({
                name,
                email,
                password
            });
            await registrationData.save();
            res.redirect("/success");
        }else{
            alert("user already exit");
            res.redirect("/error");
        }
           
    }catch(err){
        console.log(err);
        res.redirect("/error");
    }
    
});


app.get("/success",(req,res)=>{
    res.sendFile(__dirname + "/pages/success.html");
});
app.get("/error",(req,res)=>{
    res.sendFile(__dirname + "/pages/error.html");
});

app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});