// deleting item from cart 
// after clicking delete in cart 
exports.postdelete = (req, res) => {
    Cart.deleteOne({ name: req.body.name }) // deleting from cart
        .then(function () {
            res.redirect("/usercart");
        })
        .catch((err) => {
            console.log(err);
        });
}

//2..adding user cart 
// Medicine .ejs -> done 
// product info .ejs --> done 

exports.getcart = (req, res) => { // cart function
    let cart = {
        name: req.query.name,
        price: req.query.price
    };
    console.log(cart)
    con.collection('carts').insertOne(cart);
    alert('added to cart');
}


// 3.. getting user cart 
<div class="login_btn-contanier ml-0 ml-lg-5">
<a href="/usercart">
  <i class="fa fa-cart-plus"></i>
  <span> Cart </span>
</a>
</div>

exports.getusercart = (req, res) => { // getting user cart
    Cart.find({})
        .then((x) => {
            res.render('usercart', { x })
            console.log(x);
        }).catch((y) => {
            console.log(y);
        })
}


// 4.. after clicking buy now  in usercart.ejs 
exports.getdeletecart = (req, res) => {
    Cart.deleteMany()
        .then(function () {
            res.redirect("/display2");
        })
        .catch((err) => {
            console.log(err);
        });
}
