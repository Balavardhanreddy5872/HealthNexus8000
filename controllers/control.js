const express = require('express');
const app = express()
app.use(express.json());
const port = 8000;
const mongoose = require('mongoose')
const alert = require('alert')

const bodyParser = require('body-parser');
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));

const Doctors = require('../models/doctors');
const Labtests = require('../models/labtest');
const medicine = require('../models/medicine');
const medicine1 = require('../models/medicine1');
const Cart = require('../models/cart');
const User = require('../models/user');

var user;

const router = require('../routes/router')

url = 'mongodb://0.0.0.0/HealthNexus'
mongoose.connect(url);
const con = mongoose.connection;
con.on('open', () => {
    console.log("DB connected");
})

con.on('error', (err) => {
    console.log(err);
})


exports.gethome = (req, res) => {
    res.render('home')
};
exports.getindex = (req, res) => {
    medicine1.find({})
        .then((x) => {
            res.render('index', { x })
        }).catch((y) => {
            console.log(y);
            console.log('error in index')
        })
};

exports.getlogin = (req, res) => {
    res.render('login')
};
exports.gethomeuser = (req, res) => {
    res.render('homeuser')
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
    medicine.find()
        .then((data) => {

            let list = [];
            for (let i = 0; i < 26; i++) {
                list.push([]);
            }
            data.forEach(element => {
                list[element.letter.charCodeAt(0) - 'A'.charCodeAt(0)].push(element);
            });
            console.log(list);
            res.render('medicine', { list: list });
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
    const data = {
        doct: req.body.doct,
        doctors1: req.body.doctors1,
        name: req.body.name,
        mail: req.body.mail,
        date: req.body.date,
        time: req.body.time
    }

    await Doctors.insertMany([data]);

    res.render('display1', { data });
};
exports.postlabtests = async (req, res) => {
    const data = {
        name: req.body.name,
        number: req.body.number,
        formfill3: req.body.formfill3,
        package: req.body.package,
        test: req.body.test
    }
    console.log(data)
    await Labtests.insertMany([data])

    res.render('display3', { data });
};

exports.postregister = (req, res) => {
    let login = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password

    }

    con.collection('user').insertOne(login)
        .then(result => {
            res.render('homeuser', { user: result, successMsg: 'signup ' });
        })

        .catch(err => console.log(err));
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
                              res.status(400).json({ error: "password doesn't match" });
                            }
                          } else {
                            res.status(400).json({ error: "" });
                          }
                    })

}; 


exports.postadminportal = (req, res) => {

    con.collection('Admin').findOne({ email: req.body.email }).then(result => {
        if (result) {
            const resu = req.body.password === result.password;
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

        res.render("homeuser")
    })
};
exports.postdelete = (req, res) => {
    Cart.deleteOne({ name: req.body.name })
        .then(function () {
            res.redirect("/usercart");
        })
        .catch((err) => {
            console.log(err);
        });
}
exports.postdeleteuser = (req, res) => {
    User.deleteOne({ name: req.body.name })
        .then(function () {
            res.redirect("/userdisplay");
        })
        .catch((err) => {
            console.log(err);
        });
};
exports.postdeletemedicine = (req, res) => {
    medicine.deleteOne({ name: req.body.name })
        .then(function () {
            res.redirect("/medicinedisplay");
        })
        .catch((err) => {
            console.log(err);
        });
};
exports.postproductinfo = (req, res) => {
    let search = req.query.search

    medicine.find({ name: search })
        .then((x) => {
            console.log('Found search results')
            console.log(x)
            res.render('productinfo', { x })
        })
        .catch((y) => console.log("search results not found"))

}
exports.getcart = (req, res) => {
    let cart = {
        name: req.query.name,
        price: req.query.price
    };
    console.log(cart)
    con.collection('carts').insertOne(cart)
    alert('added to cart');
}

exports.getusercart = (req, res) => {
    Cart.find({})
        .then((x) => {
            res.render('usercart', { x })
            console.log(x);
        }).catch((y) => {
            console.log(y);
        })
}

exports.getupdate = (req, res) => {
    con.collection('user').findOne({ email: user.email }).then(result => {
        if (result) {
            user = result;
            res.render("updatedetails", { user });
        }
    })
}

exports.getdeletecart = (req, res) => {
    Cart.deleteMany()
        .then(function () {
            res.redirect("/payment");
        })
        .catch((err) => {
            console.log(err);
        });
}

exports.getuserdisplay = (req, res) => {
    User.find({})
        .then((x) => {
            res.render('userdisplay', { x })
            console.log(x);
        }).catch((y) => {
            console.log(y);
        })
}

exports.getmedicinedisplay = (req, res) => {
    medicine.find({})
        .then((x) => {
            res.render('medicinedisplay', { x })
            console.log(x);
        }).catch((y) => {
            console.log(y);
        })
}










