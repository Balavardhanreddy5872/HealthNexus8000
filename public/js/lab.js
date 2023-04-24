var form = document.getElementById('fm');
function lab(){
    return (nameValidation() && numberValidation() && codeValidation() && packageValidation()&&testValidation())
  }
  
function nameValidation(){
 
    const username = document.getElementById('name');
    const fname = document.getElementById('nerror');
    if(username.value == "" || username.value == null){
        fname.innerHTML="Username is required"
        fname.style.display='block';
        return false;
    }
    else {
        fname.style.display="none";
        return true;
   }
    
}
function numberValidation(){
    const number = document.getElementById('number')
    const fname = document.getElementById('merror');
    if(number.value == "" || number.value == null){
        fname.innerHTML="Phone Number contains 10 digits"
        fname.style.display='block';
        return false;
    }
    else {
        fname.style.display="none";
        return true;
    }
    
}
function codeValidation(){
    const code = document.getElementById('pincode');
    const fname = document.getElementById('perror');
    if(code.value == "" || code.value == null){
        fname.innerHTML="Pincode contains 6 digits"
        fname.style.display='block';
        return false;
    }
    else {
        fname.style.display="none";
        return true;

    }
}
function packageValidation(){
    const package = document.getElementById('package');
    const fname = document.getElementById('gerror');
    if(package.value == "" || package.value == null){
        fname.innerHTML="Choose atmost one Package"
        fname.style.display='block';
        return false;
    }
    else {
        fname.style.display="none";
        return true;

    }
}
function testValidation(){
    const test = document.getElementById('test');
    const fname = document.getElementById('terror');
    if(test.value == "" || test.value == null){
        fname.innerHTML="Choose atmost one Test"
        fname.style.display='block';
        return false;
    }
    else {
        fname.style.display="none";
        return true;

    }
}