const express = require('express');
const router = express.Router(); 
const User = require("../models/user.js");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = 'onsiteSpiderInductions'
router.get('/',async(req,res)=>{
    try {
        const email = req.query.email;
        const user = await User.findOne({email});
        console.log(user)
        res.json(user)
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    
})

router.post("/signup", [
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
   
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // console.log(req.body)
        const salt = await bcrypt.genSalt(10);
        const safePassword = await bcrypt.hash(req.body.password,salt)
        const user = await User.create({
            userDetails:req.body.userDetails,
            email: req.body.email,
            password: safePassword
        });
         console.log('success')
         res.json({success:true});

        
    } catch (err) {
        console.log(err);
        res.status(500).json({  error: err.message });
    }
});

router.post("/loginUser", [
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
   
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let email = req.body.email;
         let oldUser = await User.findOne({email});
         if(oldUser){
            let passwordTyped = req.body.password;
            let originalPassword = oldUser.password
            let passwordCheck = await bcrypt.compare(passwordTyped,originalPassword)
            if(!passwordCheck){
                // alert('Enter correct password')
               return res.json({success:false})
            }else{
              const data ={
                 user:{
                    id : oldUser._id
                 }
              }
               const authToken = jwt.sign(data,jwtSecret);
            //    console.log(authToken)
               return res.json({success:true,authToken:authToken})
            }
         }else{
           return res.json({success:false})
         }
        
         
         
        
    } catch (err) {
        console.log(err);
        res.status(500).json({  error: err.message });
    }
});

router.post("/passwordChange",[
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
   
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let email = req.body.email;
        let oldUser = await User.findOne({email});
        if(oldUser){
            
            const salt = await bcrypt.genSalt(10);
            const safePassword = await bcrypt.hash(req.body.password,salt)
          const user = await User.updateOne({email:email},{$set :{password:safePassword}})
           console.log(user)
           return res.json({success:true})
         }else{
           return res.json({success:false})
         }
    }catch(error){
      console.log(error)
      return res.json({success:false})
    }
}
)


module.exports = router;
