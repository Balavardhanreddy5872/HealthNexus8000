const express = require('express');
const path = require('path');
const app = express();
const port = 8000;
const mongoose = require('mongoose')
const alert = require('alert')
const routes = require("./routes/router");
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fectuser = require('./middleware/fetchuser');

const JWT_sceret = 'bvr12345'

app.use(routes);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

url = 'mongodb://0.0.0.0/HealthNexus'
mongoose.connect(url);

const con = mongoose.connection;

con.on('open', () => {
  console.log()
})

con.on('error', (err) => {
  console.log(err);
})




const Token = require('./models/Token');
const User = require('./models/user');

app.use(express.urlencoded({ extended: true }));
app.get('/usercart', async (req, res) => {
  try {
    const userToken = req.query.token;
    const tokenDocument = await Token.findOne({ token: userToken });

    if (!tokenDocument) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userId = tokenDocument.user;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const cartItems = user.cart;
    res.render('usercart', { cartItems });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/orderhistory', async (req, res) => {
  try {
    const userToken = req.query.token;
    const tokenDocument = await Token.findOne({ token: userToken });

    if (!tokenDocument) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    const userId = tokenDocument.user;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const cartItems = user.cart;
    res.render('orderhistory', { cartItems });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred' });
  }
});

app.put('/updateitem', fectuser, async (req, res) => {
  const itemName = req.query.name;
  const newQuantity = req.query.quantity;

  try {
    const userToken = req.query.token;
    const tokenDocument = await Token.findOne({ token: userToken });

    if (!tokenDocument) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userId = tokenDocument.user;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const itemToUpdate = user.cart.find((item) => item.name === itemName);

    if (!itemToUpdate) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }
    const oldQuantity = itemToUpdate.quantity || 1;
    const quantityChange = newQuantity - oldQuantity;
    itemToUpdate.quantity = newQuantity;
    await user.save();
    res.json({ oldQuantity, newQuantity });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred' });
  }
});
app.delete('/deleteitem', async (req, res) => {
  const itemName = req.query.name;

  try {
    const userToken = req.query.token;
    const tokenDocument = await Token.findOne({ token: userToken });

    if (!tokenDocument) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    const userId = tokenDocument.user;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const itemIndex = user.cart.findIndex((item) => item.name === itemName);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }
    user.cart.splice(itemIndex, 1);
    await user.save();

    res.json({ message: 'Item deleted from cart successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred' });
  }
});


// Completed succesful  signup to ajax 
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const validationErrors = [];
  if (name.length < 5) {
    validationErrors.push("Name should be at least 5 characters");
  }
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/;
  if (!passwordRegex.test(password)) {
    validationErrors.push("Password should contain one capital letter and a special character");
  }
  const emailRegex = /@/;
  if (!emailRegex.test(email)) {
    validationErrors.push("Invalid email format");
  }

  if (validationErrors.length > 0) {
    return res.status(200).json({ validationErrors });
  }
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      validationErrors.push("User already Exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    if (email === "admin@gmail.com") {
      return res.redirect('/adminportal');
    }
    const authToken = jwt.sign({ userId: newUser._id }, JWT_sceret);

    const tokenInstance = new Token({
      token: authToken,
      user: newUser._id
    });
    await tokenInstance.save();

    res.status(201).json({ authToken });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});
app.post("/login", async (req, res) => {
  const { email, password} = req.body;
  const validationErrors = [];
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/;
  if (!passwordRegex.test(password)) {
    validationErrors.push("Invalid password");
  }
  const emailRegex = /@/;
  if (!emailRegex.test(email)) {
    validationErrors.push("Invalid email format");
  }

  if (validationErrors.length > 0) {
    return res.status(200).json({ validationErrors });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      validationErrors.push('User not found');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      validationErrors.push('Wrong password');
    }
    const authToken = jwt.sign({ userId: user._id }, JWT_sceret);

    const tokenInstance = new Token({
      token: authToken,
      user: user._id
    });
    await tokenInstance.save();

    res.status(200).json({ authToken });

  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});


app.listen(port, function () {
  console.log("Server is running on port 8000");
});

const medicine1 = require('./models/medicine1');
app.get("/swiper_content", (req, res) => {
  medicine1.find({})
    .then((x) => {
      res.render('swiper_content', { x })
    }).catch((y) => {
      console.log(y);
      console.log('error in index')
    })

});

const Cart = require('./models/cart');
function getUserIdFromToken(req) {
  const token = req.headers.authorization.split(' ')[1]; 
  const decodedToken = jwt.verify(token, 'your-secret-key'); 
  return decodedToken.userId;
}































































































































































































































































































































































































































































































































































































































































































const Labtests = require('./models/labtest')
const medicine = require('./models/medicine')
// const Cart = require('./models/cart')
// const User = require('./models/user')
const Blog = require('./models/blog')
const Reviews = require('./models/reviews')

app.post('/labtests', async (req, res) => {
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

});


// app.post('/register', (req, res) => {
//     let login = {
//         name : req.body.name,
//         email : req.body.email,
//         password: req.body.password

//     }

//     con.collection('user').insertOne(login)
//     .then(result=>{
//         res.render('login', { user : result , successMsg : 'signup '  });
//         })

//     .catch(err => console.log(err));
// })
// app.post("/login", async function(req, res){
//     try {
//          con.collection('user').findOne({ email: req.body.email }).then(result=>
//             { 
//                 if (result) {
//                     const resu = req.body.password === result.password;
//                     if(resu) {
//                          user=result;
//                       res.render('homeuser',{user});
//                     } else {
//                       res.status(400).json({ error: "password doesn't match" });
//                     }
//                   } else {
//                     res.status(400).json({ error: "User doesn't exist,signup please!" });
//                   }
//             })

//       } catch (error) {
//         res.status(400).json({ error });
//       }
// });

app.post("/adminportal", async function (req, res) {
  try {
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

  } catch (error) {
    res.status(400).json({ error });
  }
});
app.get("/productinfo", function (req, res) {

  let search = req.query.search

  medicine.find({ name: search })
    .then((x) => {
      console.log('Found search results')
      console.log(x)
      res.render('productinfo', { x })
    })
    .catch((y) => console.log("search results not found"))

});

app.post("/update", async function (req, res) {
  User.updateOne({ email: req.body.email }, { $set: { name: req.body.name, email: req.body.email, password: req.body.password } }).then(result => {

    res.render("index")
  })

});

app.post("/delete", function (req, res) {
  Cart.deleteOne({ name: req.body.name })
    .then(function () {
      res.redirect("/usercart");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/update', (req, res) => {
  User.findOne({ email: req.body.email }).then(result => {
    if (result) {
      User = result;
      res.render("updatedetails", { User });
    }
  })
});

app.post("/deleteuser", function (req, res) {
  User.deleteOne({ name: req.body.name })
    .then(function () {
      res.redirect("/userdisplay");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post('/message', async (req, res) => {

  console.log(req.body)
  const blog = {
    name: req.body.name,
    subject: req.body.subject,
    message: req.body.message
  }


  await Blog.insertMany([blog]);
  res.render('adminportal');

});
app.get('/msgdisplay', (req, res) => {
  Blog.find({})
    .then((x) => {
      res.render('msgdisplay', { x })
      console.log(x);
    }).catch((y) => {
      console.log(y);
    })
})
app.get("/review", (req, res) => {
  res.render('review');
})
app.post('/revsub', (req, res) => {

  console.log(req.body)
  const revsub = {
    name: req.body.name,
    email: req.body.email,
    rating: req.body.rating,
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
app.get('/reviewdisplay', (req, res) => {
  Reviews.find({})
    .then((x) => {
      res.render('reviewdisplay', { x })
      console.log(x);
    }).catch((y) => {
      console.log(y);
    })
})

app.get('/doctors', (req, res) => {
  res.render('Doctors')
})
app.get('/Doctorreg', (req, res) => {
  res.render('Doctorreg')
})
app.get('/doctorlogin', (req, res) => {
  res.render('Doctorlogin')
});
app.get("/Doctorsportal", function (req, res) {
  res.render('Doctorsportal')
});



app.post('/doctorlogin', async (req, res) => {
  const data = {
    Name: req.body.fullname,
    mail: req.body.email,
    date_of_birth: req.body.date,
    password: req.body.password,
    Specility: req.body.Specility
  }

  // await  Doctors.insert([data])

  con.collection("Doctorreg").insertOne(data)
    .then(result => {
      res.render('Doctorlogin', { user: result, successMsg: 'registered successfully ' });
    })
    .catch(err => console.log(err));

});




app.post('/doctor', async (req, res) => {
  const data = {
    doct: req.body.doct,
    doctors1: req.body.doctors1,
    name: req.body.name,
    mail: req.body.mail,
    date: req.body.date,
    time: req.body.time
  }


  con.collection("Doctors").insertOne(data)
  res.render("Doctors2");



});

var use;
app.post("/Doctorsportal", function (req, res) {
  try {
    con.collection('Doctorreg').findOne({ mail: req.body.email }).then(async result => {
      let us = result;

      if (us) {
        const resu = req.body.password === us.password;
        if (resu) {
          use = result;
          const k = await con.collection("Doctors").find().toArray()

          res.render("Doctorsportal", { user: use, patient: k });
        } else {
          // res.status(400).json({ error: "password doesn't match" });
          res.render("Doctorlogin");
        }
      } else {
        // res.status(400).json({ error: "User doesn't exist,signup please!" });
        res.render("Doctorlogin");
      }
    })

  } catch (error) {
    res.status(400).json({ error });
  }
});

app.post('/deletedoctor', (req, res) => {
  const id = req.body._id;
  // Use MongoDB to delete the row with the specified ID
  con.collection('Doctors').deleteOne({ _id: new ObjectId(id) }, (err, result) => {
    if (err) {
      console.log(err);
      // Handle the error here
      res.status(500).send('Error deleting row');
    } else {
      console.log('Row deleted');

      con.collection('Doctors').find().toArray()
        .then(result => {
          res.render('Doctorsportal', { patient: result, user: use });
        })
      // Handle the success case here

    }
  });
});

//
//ADMIN PORTAL OPERATIONS
//ADMIN PORTAL OPERATIONS
app.get('/show-medicine', async (req, res) => {
  const data = await medicine.find({})
  res.render('medicinedisplay', { data })
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
  name = req.body.name;
  await con.collection("medicines").insertOne(newProduct)
    .then(result => {
      res.render("adminportal")
    })
    .catch(err => console.log(err));
})

app.post('/deletemedicine', async (req, res) => {
  await con.collection("medicines").deleteOne({ _id: new mongoose.Types.ObjectId(req.body.id) })
  res.redirect('/show-medicine')
});

// Update data in MongoDB
app.post('/updatemedicine', async (req, res) => {
  // MongoClient.connect(url, (err, db) => {
  //   if (err) throw err;
  //   const dbo = db.db('mydb');
  //   const id = {_id: new mongoose.Types.ObjectID(req.body.id)};
  const updatedData = {
    name: req.body.name,
    price1: req.body.price1,
    price2: req.body.price2
  };
  await con.collection("medicines").updateOne({ _id: new mongoose.Types.ObjectId(req.body.id) }, { $set: updatedData }, (err, result) => {
    // if (err) throw err;
    res.redirect('/show-medicine');
    // db.close();
  });
  // });
});

app.get('/blog', (req, res) => {

  res.render('blog');
})
