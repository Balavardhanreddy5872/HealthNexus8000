const express = require('express');
const path = require('path');
const app = express();
const ejs = require('ejs');
const port = 8000;
const mongoose = require('mongoose')
const alert = require('alert')
var user;
const routes =  require("./routes/router");
const { ObjectId } = require('mongodb');

app.use(routes);

app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: false }));
const { get } = require("http");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs')

url = 'mongodb://0.0.0.0/HealthNexus'
mongoose.connect(url);

const con = mongoose.connection;

con.on('open', () => {
    console.log()
})

con.on('error', (err)=> {
    console.log(err);
})


app.listen(port, function () {
    console.log("server is runnig on the port 8000");
});
































































































































































































































































































































































































































































































































































































































































































const Labtests = require('./models/labtest')
const medicine = require('./models/medicine')
const Cart = require('./models/cart')
const User = require('./models/user')
const Blog = require('./models/blog')
const Reviews = require('./models/reviews')

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
        res.render('login', { user : result , successMsg : 'signup '  });
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
});

app.post("/deleteuser",function(req,res){
    User.deleteOne({name:req.body.name})
    .then(function(){
        res.redirect("/userdisplay");
    })
    .catch((err)=>{
        console.log(err);
    });
});

app.post('/message',async(req,res)=>{

    console.log(req.body)
    const blog ={
        name : req.body.name,
        subject : req.body.subject,
        message : req.body.message
    }


    await Blog.insertMany([blog]);
    res.render('adminportal');

});
app.get('/msgdisplay',(req,res)=>{
    Blog.find({})
    .then((x) => {
        res.render('msgdisplay', { x })
        console.log(x);
    }).catch((y) => {
        console.log(y);
    })
})
app.get("/review",(req,res)=>{
    res.render('review');
})
app.post('/revsub',(req,res)=>{

    console.log(req.body)
    const revsub ={
        name : req.body.name,
        email : req.body.email,
        rating : req.body.rating,
        review: req.body.review
    }


    Reviews.insertMany([revsub]);
    Reviews.find({})
    .then((x) => {
        res.render('reviewdisplay', { x })
        console.log(x);
    }).catch((y) => {
        console.log(y);
    })

});
app.get('/reviewdisplay',(req,res)=>{
  Reviews.find({})
  .then((x) => {
      res.render('reviewdisplay', { x })
      console.log(x);
  }).catch((y) => {
      console.log(y);
  })
})

app.get('/doctors',(req,res)=>{
    res.render('Doctors')
})
app.get('/Doctorreg',(req,res)=>{
    res.render('Doctorreg')
})
app.get('/doctorlogin',(req,res)=>{
    res.render('Doctorlogin')
});
app.get("/Doctorsportal", function(req,res) {
    res.render('Doctorsportal')
});



app.post('/doctorlogin',  async (req,res)=> {
    const data= {
        Name : req.body.Name,
        mail: req.body.Email,
        date_of_birth: req.body.DOB,
        City: req.body.City,
        Country: req.body.Country,
        password: req.body.password, 
        Language: req.body.Language,
        Medical_school: req.body.MedSch,
        MedicalId: req.body.MedID,
        Specility: req.body.Specility
    }
 
    // await  Doctors.insert([data])
        
           con.collection("Doctorreg").insertOne(data)
           .then(result=>{
                res.render('Doctorlogin', { user : result , successMsg : 'registered successfully '  });
                })  
                .catch(err => console.log(err)); 
        
    }) ;




app.post('/doctor',  async (req,res)=> {
const data= {
        doct : req.body.doct,
        doctors1: req.body.doctors1,
        name: req.body.name,
        mail: req.body.mail,
        date:req.body.date,
        time: req.body.time 
    }
 

    con.collection("Doctors").insertOne(data)  
    res.render("Doctors2");  

    
    
});

var use;
app.post("/Doctorsportal",  function(req, res){  
    try {
         con.collection('Doctorreg').findOne({ mail: req.body.email }).then(async result=>
            { 
                let us = result;
                
                if (us) {
                    const resu = req.body.password === us.password;
                    if(resu) {
                         use=result;
                         const k= await con.collection("Doctors").find().toArray() 
                        
                      res.render("Doctorsportal",{user:use,patient:k});
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

app.post('/deletedoctor', (req, res) => {
  const id = req.body._id;
  // Use MongoDB to delete the row with the specified ID
  con.collection('Doctors').deleteOne({_id: new ObjectId(id)}, (err, result) => {
    if (err) {
      console.log(err);
      // Handle the error here
      res.status(500).send('Error deleting row');
    } else {
      console.log('Row deleted');
      
      con.collection('Doctors').find().toArray()
      .then(result=>{
       res.render('Doctorsportal',{patient:result,user:use});
      })
      // Handle the success case here
      
    }
  });
});

//
//ADMIN PORTAL OPERATIONS
//ADMIN PORTAL OPERATIONS
app.get('/show-medicine',async (req,res)=>{
  const data = await medicine.find({})
  res.render('medicinedisplay',{data})
})
var name;

app.post('/add', async (req, res) => {
  // const collection = client.db("HealthNexus").collection("medicines");

  const newProduct = {
    letter: req.body.letter,
    name: req.body.name,
    image: req.body.image,
    price1: parseFloat(req.body.price1),
    price2: parseFloat(req.body.price2)
  };
  name=req.body.name;
 await con.collection("medicines").insertOne(newProduct)
  .then(result=>{
     res.render("adminportal")
  })
  .catch(err => console.log(err));
})

app.post('/deletemedicine', async (req, res) => {
  await con.collection("medicines").deleteOne({_id: new mongoose.Types.ObjectId(req.body.id)})
  res.redirect('/show-medicine')
});

// Update data in MongoDB
app.post('/updatemedicine', async(req, res) => {
  // MongoClient.connect(url, (err, db) => {
  //   if (err) throw err;
  //   const dbo = db.db('mydb');
  //   const id = {_id: new mongoose.Types.ObjectID(req.body.id)};
    const updatedData = {
      name: req.body.name,
      price1: req.body.price1,
      price2: req.body.price2
    };
   await con.collection("medicines").updateOne({_id: new mongoose.Types.ObjectId(req.body.id)}, {$set: updatedData}, (err, result) => {
      // if (err) throw err;
      res.redirect('/show-medicine');
      // db.close();
    });
  // });
});

app.get('/blog',(req,res)=>{

  res.render('blog');
})
