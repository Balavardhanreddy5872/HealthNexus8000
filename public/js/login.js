var form1 = document.getElementById('form1');
var form2 = document.getElementById('form2');
var sbutton = document.getElementById("sbutton");

function loginValidator() {
  // Get form elements
  var nameInput = document.getElementById("name-form1");
  var emailInput = document.getElementById("mail-form1");
  var passwordInput = document.getElementById("pass-form1");
  var errorMessage = "";

  // Check if name is empty
  var namePattern = new RegExp(nameInput.pattern);
  
  if (!namePattern.test(nameInput.value)) {
    var nameError = document.getElementById("morf3");
    nameError.innerHTML = "Name can only contain letters";
    return false;
  }

  // Check if email is valid
  if (!isValidEmail(emailInput.value)) {
    errorMessage += "Please enter a valid email address.\n";
    document.getElementById("morf1").innerHTML = "Please enter a valid email address.";
  } else {
    document.getElementById("morf1").innerHTML = "";
  }

  // Check if password is at least 5 characters long
  if (passwordInput.value.length < 5) {
    errorMessage += "Password must be at least 5 characters long.\n";
    document.getElementById("morf2").innerHTML = "Password must be at least 5 characters long.";
  } else {
    document.getElementById("morf2").innerHTML = "";
  }

  // If there is an error, prevent form submission and display error message
  if (errorMessage !== "") {
    alert(errorMessage);
    return false;
  }

  // If there is no error, allow form submission
  return true;
}

function isValidEmail(email) {
  // Regular expression for email validation
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


function signupValidator(){
  return (userValidation() && Validatemail() && passwordValidate())
}


var pattern = /[`!#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

function ValidateEmail() {
  const mail = document.getElementById('mail-form1');
  const ifname = document.getElementById('morf1');

  if(mail.value == "" || mail.value == null){
    ifname.innerHTML="**mail is required**";
    ifname.style.display='block';
    return false;
}
  else{
  ifname.style.display="none";
    return true;
}
}
function Validatepassword(){
  const password = document.getElementById('pass-form1');
  const ipass = document.getElementById('morf2');
  if(password.value == '' || password.value == null){
    ipass.innerHTML= "**Fill the password please! **";
    ipass.style.display='block';
    return false;
    
  }
  if(password.length < 8){
    ipass.innerHTML="**Password contains atleast 8 characters**";
    ipass.style.display='block';4
    return false;
  }
  else{
    ipass.style.display="none";
    return true;
  }
}
function userValidation(){
  
  const username = document.getElementById('name');
    const fname = document.getElementById('omrf1');
    

    if(username.value === null || username.value === ""){
        fname.innerHTML="**Username is required**";
        // e.preventDefault();
        fname.style.display='block';
        return false;
    }
   if(username.value.match(pattern)){
      fname.innerHTML="**Username doesn't have special characters**";
      // e.preventDefault();
      fname.style.display='block';
        return false;
    }
    else {
        fname.style.display="none";
        return true;
   }
}

function Validatemail(){
  const mail = document.getElementById('email');
  const ifname = document.getElementById('omrf2');

  if(mail.value === null || mail.value === ""){
    ifname.innerHTML="**mail is required**";
    ifname.style.display='block';
    return false;
}
else{
  ifname.style.display="none";
    return true;
}
}
function passwordValidate(){
  const password = document.getElementById('password');
  const ipass = document.getElementById('omrf3');
  if(password.value === null || password.value ===""){
    
    ipass.innerHTML= "**Fill the password please!**";
    ipass.style.display='block';
    return false;
  }
 if(password.length < 8){
  
    ipass.innerHTML="**Password contains atleast 8 characters**";
    ipass.style.display='block';
    return false;
  }
  else{
    ipass.style.display="none";
    return true;
  }
}
function conformation(){
  const password = document.getElementById('password').value;
  const cpassword = document.getElementById('cpassword').value;
  const icpass = document.getElementById('omrf4');
  console.log(password,cpassword);
  if(password!=cpassword){
    icpass.innerHTML= "**Password is incorrect!**";
    icpass.style.display="block";
    return false;
  }
  else{
    icpass.style.display="none";
    return true;
  }
}

