const {Router} = require('express')
const router = Router()
const bodyParser = require('body-parser');
router.use(bodyParser.json());
const controller = require('../controllers/control')

router.get('/',controller.gethome);
router.get('/index',controller.getindex);
router.get('/login',controller.getlogin);
router.get('/homeuser',controller.gethomeuser);
router.get('/about',controller.getabout);
router.get('/contact',controller.getcontact);
// router.get('/Doctors',controller.getdoctors);
router.get('/labtests',controller.getlabtests);
router.get('/medicine',controller.getmedicine);
// router.get('/register',controller.getregister);
router.get('/Admin',controller.getadmin);
router.get('/adminportal',controller.getadminportal);
router.get('/payment',controller.getpayment);
router.get('/display1',controller.getdisplay1);
router.get('/display2',controller.getdisplay2);
router.get('/display3',controller.getdisplay3);
router.get('/display4',controller.getdisplay4);
router.get('/adminlogin',controller.getadminlogin);
// router.post('/doctor',controller.postdoctor);
// router.post('/labtests',controller.postlabtests);
// router.post('/register',controller.postregister);
// router.post('/login',controller.postlogin);
// router.post('/adminportal',controller.postadminportal);
router.get('/productinfo',controller.postproductinfo);
router.get('/cart',controller.getcart);
router.get('/usercart',controller.getusercart);
// router.get('/update',controller.getupdate);
// router.post('/update',controller.postupdate);
// router.post('/delete',controller.postdelete);
router.get('/deletecart',controller.getdeletecart);
router.get('/userdisplay',controller.getuserdisplay);
// router.post('/deleteuser',controller.postdeleteuser);
router.get('/medicinedisplay',controller.getmedicinedisplay);
// router.post('/deletemedicine',controller.postdeletemedicine);


module.exports= router;




