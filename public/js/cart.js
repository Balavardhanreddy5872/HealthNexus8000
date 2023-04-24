// Cart funtioning
let cartIcon = document.querySelector("#Cart-icon");
let Cart = document.querySelector(".Cart");
let closeCart = document.querySelector("#close-cart");

//opening the cart
cartIcon.onclick = () => {
    Cart.classList.add("active");
};
//closing the cart
closeCart.onclick = () => {
    Cart.classList.remove("active");
};

// Cart Working  
if(document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded", ready);
}else{
    ready();
}
function togglepopup(){
    document.getElementById("popupclosecart").classList.toggle("active");
}

//Making function
function ready(){
    //Remove items from cart
    var reomveCartButtons = document.getElementsByClassName("Cart-remove");
    console.log(reomveCartButtons);
    for(var i = 0;i < reomveCartButtons.length;i++){
        var button = reomveCartButtons[i];
        button.addEventListener("click",removeCartItem);
    }
    var quantityInputs = document.getElementsByClassName("Cart-quantity");
    for(var i = 0;i < quantityInputs.length; i++){
        var input = quantityInputs[i];
        input.addEventListener("change", quantitychanged);
    }
    //Add TO CART
    var addCart = document.getElementsByClassName("button");
    for(var i=0; i < addCart.length; i++){
        var button = addCart[i];
        button.addEventListener("click", addCartClicked);
    }
    // BUY BUTTON WORK
    document.getElementsByClassName("btn-buy")[0].addEventListener('click', buyButtonClicked);
}
function buyButtonClicked(){
    // alert('Hurray! Your Order Is Placed');
    var cartContent = document.getElementsByClassName("Cart-content")[0];
    while(cartContent.hasChildNodes()){
        cartContent.removeChild(cartContent.firstChild);
    }
    updatetotal();
}

//Remove items from Cart
function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updatetotal();
}
//Quantity changes
function quantitychanged(event){
    var input = event.target;
    if(isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updatetotal();   
}
//ADD TO CART
function addCartClicked(event) {
    var button = event.target;
    var orderitems = button.parentElement;
    var title = orderitems.getElementsByClassName("name")[0].innerText;
    var price = orderitems.getElementsByClassName("description")[0].innerText;
    // var itemImg = orderitems.getElementsByClassName("card-img")[0].src;
   additemToCart(title,price);
   updatetotal();
}
function additemToCart(title,price){
    var cartorderBox = document.createElement("div");
    cartorderBox.classList.add("Cart-box");
    var cartItems = document.getElementsByClassName("Cart-content")[0];
    var cartItemNames = cartItems.getElementsByClassName("name");
    for(var i = 0; i < cartItemNames.length; i++){
        if(cartItemNames[i].innerText == title){
        alert("You have already add this item to cart");
        return;
        }
    }



var cartBoxContent = `  
                       
                        <div class="card-content">
                        <h2 class="name">${title}</h2>
                        <p class="description"><b>${price}</b></p>
                       <input type="number" value = "1" class="Cart-quantity">
                        </div> 
                        <i class='fa fa-trash Cart-remove'></i> ` ;
                   
    
 cartorderBox.innerHTML = cartBoxContent;
 cartItems.append(cartorderBox);
 cartorderBox.getElementsByClassName("Cart-remove")[0].addEventListener('click', removeCartItem);
 cartorderBox.getElementsByClassName("Cart-quantity")[0].addEventListener('change', quantitychanged);
}
function updatetotal(){
    var cartContent = document.getElementsByClassName("Cart-content")[0];
    var cartBoxes = cartContent.getElementsByClassName("Cart-box");
    var total = 0;
    for(var i= 0; i < cartBoxes.length; i++){
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.getElementsByClassName("description")[0];
        var quantityElement = cartBox.getElementsByClassName("Cart-quantity")[0];
        var price = parseFloat(priceElement.innerText.replace("₹",""));
        var quantity = quantityElement.value;
        total = total + price * quantity;
    }

    

        total = Math.round(total * 100) / 100;

        document.getElementsByClassName("total-price")[0].innerText = "₹" + total;
        
}
