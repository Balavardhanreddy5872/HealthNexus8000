const express = require('express');
const app = express()
app.use(express.json());
const port = 8000;
const mongoose = require('mongoose')
const alert = require('alert')

const bodyParser = require("body-parser");
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));

const Doctors = require('./models/doctors')
const Labtests = require('./models/labtest')
const medicine = require('./models/medicine')
const Cart = require('./models/cart')
const User = require('./models/user')
const Blog = require('./models/blog')
const Reviews = require('./models/reviews')

var user;

const router = require('../routes/router')

url = 'mongodb://0.0.0.0/HealthNexus'
mongoose.connect(url); // mongoconnection
const con = mongoose.connection;
con.on('open', () => {
    console.log("DB connected"); // db connected
})

con.on('error', (err) => {
    console.log(err);
})


exports.gethome = (req, res) => { // getting home page from exports router
    res.render('home') // render home page
};
exports.getindex = (req, res) => {  // getting index page from exports router
    medicine1.find({}) // medicine1 finding database name
        .then((x) => {
            res.render('index', { x })
        }).catch((y) => {
            console.log(y);
            console.log('error in index')
        })
};

exports.getlogin = (req, res) => {
    res.render('login') // opening login page 
};
exports.gethomeuser = (req, res) => {
    res.render('homeuser') // opening home user page
   
};
exports.getabout = (req, res) => {
    res.render('about')
};
exports.getcontact = (req, res) => {
    res.render('contact')
};
exports.getdoctors = (req, res) => {
    res.render('Doctors')
};
exports.getlabtests = (req, res) => {
    res.render('labtests')
};
exports.getmedicine = (req, res) => {
    medicine.find() // finding data in medicine database
        .then((data) => {

            let list = [];
            for (let i = 0; i < 26; i++) {
                list.push([]);  // pushing data into ejs file
            }
            data.forEach(element => {
                list[element.letter.charCodeAt(0) - 'A'.charCodeAt(0)].push(element);  // different content in alphabetic order
            });
            console.log(list);
            res.render('medicine', { list: list }); // rendering to medicine page
        }).catch((err) => {
            console.log(err);
        });
};
exports.getregister = (req, res) => {
    res.render('login'); 
};
exports.getadmin = (req, res) => {
    res.render('admin');
};
exports.getadminportal = (req, res) => {
    res.render('adminportal');
};
exports.getpayment = (req, res) => {
    res.render('payment');
};
exports.getdisplay1 = (req, res) => {
    res.render('display1');
};
exports.getdisplay2 = (req, res) => {
    res.render('display2');
};
exports.getdisplay3 = (req, res) => {
    res.render('display3');
};
exports.getdisplay4 = (req, res) => {
    res.render('display4');
};
exports.getadminlogin = (req, res) => {
    res.render('adminlogin');
};
exports.postdoctor = async (req, res) => {
    console.log(req.body);  
    const data = { // storing data from doctors to database
        doct: req.body.doct,
        doctors1: req.body.doctors1,
        name: req.body.name,
        mail: req.body.mail,
        date: req.body.date,
        time: req.body.time
    }

    await Doctors.insertMany([data]);

    res.render('display1', { data }); // display to display1 page
};
exports.postlabtests = async (req, res) => {
    const data = { // getting data from labtest page
        name: req.body.name,
        number: req.body.number,
        formfill3: req.body.formfill3,
        package: req.body.package,
        test: req.body.test
    }
    console.log(data)
    await Labtests.insertMany([data])

    res.render('display3', { data }); // sending data to display3 page 
};

exports.postregister = (req, res) => {
    let login = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password

    }

    con.collection('user').insertOne(login)
        .then(result => {
            res.render('login', { user: result, successMsg: 'signup ' });
    })

        .catch(err => console.log(err)); // register page
};



exports.postlogin=(req,res)=>{
            
                 con.collection('user').findOne({ email: req.body.email }).then(result=>
                    { 
                        if (result) {
                            const resu = req.body.password === result.password;
                            if(resu) {
                                 user=result;
                              res.render('homeuser',{user});
                            } else {
                              res.status(400).json({ error: "password doesn't match" }); // verification from login page 
                            }
                          } else {
                            res.status(400).json({ error: "" }); 
                          }
                    })

}; 


exports.postadminportal = (req, res) => {

    con.collection('Admin').findOne({ email: req.body.email }).then(result => {
        if (result) {
            const resu = req.body.password === result.password; // admin portal validation from database
            if (resu) {
                res.render("adminportal");
            } else {
                res.status(400).json({ error: "password doesn't match" });
            }
        } else {
            alert('user doesnot exists');
        }
    })

};


exports.postupdate = async (req, res) => {
    await con.collection("user").updateOne({ email: req.body.email }, { $set: { name: req.body.name, email: req.body.email, password: req.body.password } }).then(result => {

        res.render("homeuser") // post updating of user
    })
};
exports.postdelete = (req, res) => {
    Cart.deleteOne({ name: req.body.name }) // deleting from cart
        .then(function () {
            res.redirect("/usercart"); 
        })
        .catch((err) => {
            console.log(err);
        });
}
exports.postdeleteuser = (req, res) => {
    User.deleteOne({ name: req.body.name }) //deleting user
        .then(function () {
            res.redirect("/userdisplay");
        })
        .catch((err) => {
            console.log(err);
        });
};
exports.postdeletemedicine = (req, res) => {
    medicine.deleteOne({ name: req.body.name }) // deleting medicine
        .then(function () {
            res.redirect("/medicinedisplay");
        })
        .catch((err) => {
            console.log(err);
        });
};
exports.postproductinfo = (req, res) => {
    let search = req.query.search

    medicine.find({ name: search }) //serach for finding medicine
        .then((x) => {
            console.log('Found search results')
            console.log(x)
            res.render('productinfo', { x })
        })
        .catch((y) => console.log("search results not found"))

}
exports.getcart = (req, res) => { // cart function
    let cart = {
        name: req.query.name,
        price: req.query.price
    };
    console.log(cart)
    con.collection('carts').insertOne(cart)
    alert('added to cart');
}

exports.getusercart = (req, res) => { // getting user cart
    Cart.find({})
        .then((x) => {
            res.render('usercart', { x })
            console.log(x);
        }).catch((y) => {
            console.log(y);
        })
}

exports.getupdate = (req, res) => { // update details
    con.collection('user').findOne({ email: user.email }).then(result => {
        if (result) {
            user = result;
            res.render("updatedetails", { user });
        }
    })
}

exports.getdeletecart = (req, res) => {  //deleting cart
    Cart.deleteMany()
        .then(function () {
            res.redirect("/payment");
        })
        .catch((err) => {
            console.log(err);
        });
}

exports.getuserdisplay = (req, res) => { //user display
    User.find({})
        .then((x) => {
            res.render('userdisplay', { x })
            console.log(x);
        }).catch((y) => {
            console.log(y);
        })
}

exports.getmedicinedisplay = (req, res) => { //medicine display
    medicine.find({})
        .then((x) => {
            res.render('medicinedisplay', { x })
            console.log(x);
        }).catch((y) => {
            console.log(y);
        })
}

exports.getblog = (req, res) =>{
    res.render('blog');
}

exports.getblog =  async(req, res) =>{
    console.log(req.body)
    const blog ={
        name : req.body.name,
        subject : req.body.subject,
        message : req.body.message
    }


    await Blog.insertMany([blog]);
}

exports.getmsgdisplay = (req,res)=>{
    Blog.find({})
    .then((x) => {
        res.render('msgdisplay', { x })
        console.log(x);
    }).catch((y) => {
        console.log(y);
    })
}

expoerts.getreview=(req,res)=>{
    res.render('review');
}
app.post('/revsub',async(req,res)=>{

    console.log(req.body)
    const revsub ={
        name : req.body.name,
        email : req.body.email,
        rating : req.body.rating,
        review: req.body.review
    }


    await Reviews.insertMany([revsub]);

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

//
//  
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










