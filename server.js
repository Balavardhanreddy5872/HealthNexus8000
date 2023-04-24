const express = require('express');
const path = require('path');
const app = express();
const ejs = require('ejs');
const port = 8000;
const mongoose = require('mongoose')
const alert = require('alert')
var user
const routes =  require("./routes/router");
app.use(routes);

const Doctors = require('./models/doctors')
const Labtests = require('./models/labtest')
const medicine = require('./models/medicine')
const medicine1 = require('./models/medicine1')
const Cart = require('./models/cart')
const User = require('./models/user')
const bodyParser = require("body-parser");
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: false }));
const { get } = require("http");
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs')

url = 'mongodb://0.0.0.0/HealthNexus'
mongoose.connect(url);

const con = mongoose.connection;

con.on('open', () => {
    console.log("DB connected");
})

con.on('error', (err)=> {
    console.log(err);
})

app.post('/doctor',  async (req,res)=> {
    console.log(req.body);
    const data= {
        doct : req.body.doct,
        doctors1: req.body.doctors1,
        name: req.body.name,
        mail: req.body.mail,
        date:req.body.date,
        time: req.body.time 
    }
 
    await  Doctors.insertMany([data]);
    
    res.render('display1',{data}); 
    
});

app.post('/labtests',  async (req,res)=> {
    const data= {
        name : req.body.name,
        number: req.body.number,
        formfill3: req.body.formfill3,
        package:req.body.package,
        test:req.body.test 
    }
  console.log(data)
    await  Labtests.insertMany([data])
    
    res.render('display3',{data}); 
    
});


app.post('/register', (req, res) => {
    let login = {
        name : req.body.name,
        email : req.body.email,
        password: req.body.password
        
    }
    
    con.collection('user').insertOne(login)
    .then(result=>{
        res.render('homeuser', { user : result , successMsg : 'signup '  });
        })

    .catch(err => console.log(err));
})
app.post("/login", async function(req, res){
    try {
         con.collection('user').findOne({ email: req.body.email }).then(result=>
            { 
                if (result) {
                    const resu = req.body.password === result.password;
                    if(resu) {
                         user=result;
                      res.render('homeuser',{user});
                    } else {
                      res.status(400).json({ error: "password doesn't match" });
                    }
                  } else {
                    res.status(400).json({ error: "User doesn't exist,signup please!" });
                  }
            })
       
      } catch (error) {
        res.status(400).json({ error });
      }
});
app.post("/adminportal", async function(req, res){
    try {
        con.collection('Admin').findOne({ email: req.body.email }).then(result=>
            { 
                if (result) {
                    const resu = req.body.password === result.password;
                    if(resu) {
                      res.render("adminportal");
                    } else {
                      res.status(400).json({ error: "password doesn't match" });
                    }
                  } else {
                    alert('user doesnot exists');
                  }
            })
       
      } catch (error) {
        res.status(400).json({ error });
      }
});
app.get("/productinfo", function (req, res) {
    
    let search = req.query.search

    medicine.find({name: search})
     .then((x)=>{console.log('Found search results')
      console.log(x)
      res.render('productinfo',{x})})
    .catch((y)=>console.log("search results not found"))
    
}); 

app.post("/update",async function (req,res){
    await  con.collection("user").updateOne({email:req.body.email},{$set:{name:req.body.name,email:req.body.email,password:req.body.password}}).then(result=>{
         
         res.render("homeuser")
      })
      
});

app.post("/delete",function(req,res){
    Cart.deleteOne({name:req.body.name})
    .then(function(){
        res.redirect("/usercart");
    })
    .catch((err)=>{
        console.log(err);
    });
});

app.get('/update', (req, res) => {
    con.collection('user').findOne({ email: user.email }).then(result => {
        if (result) {
            user = result;
            res.render("updatedetails", { user });
        }
    })
})

app.post("/deleteuser",function(req,res){
    User.deleteOne({name:req.body.name})
    .then(function(){
        res.redirect("/userdisplay");
    })
    .catch((err)=>{
        console.log(err);
    });
});


app.post("/deletemedicine",function(req,res){

    medicine.deleteOne({name:req.body.name})
    .then(function(){
        res.redirect("/medicinedisplay");
    })
    .catch((err)=>{
        console.log(err);
    });
});

app.listen(port, function () {
    console.log("server is runnig on the port 8000");
});

