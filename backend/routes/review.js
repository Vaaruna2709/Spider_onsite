const express = require('express');
const router = express.Router(); 
const Review = require("../models/review.js");
const { body, validationResult } = require('express-validator');
const Bid = require('../models/bids.js')
router.post('/:id',[
    body('review').isString(),
    body('rating').isInt({min:1,max:5}).withMessage("Rating must be within the range 1 to 5"),
    body('buyer').isString()
   
],async(req,res)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const review = req.body.review;
        const rating = req.body.rating;
        const buyer = req.body.buyer;
        const alreadyUser = await Bid.findOne({buyer:buyer})
        if(alreadyUser){
            const remark = await Review.create({
                review:review,
                rating:rating,
                buyer:buyer,
                productId:req.params.id
             });
             res.json({success:true,remark:remark})
        }else{
            res.json({success:false})
        }
       
        // console.log(user)
       
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    
})
router.get('/:id',async(req,res)=>{
    try {
       
       
            
            let sum=0;
            const remarks = await Review.find({productId:req.params.id});
            remarks.forEach(remark=>{
                sum = sum + remark.rating;
            })
            console.log(sum)
            let avgRating = sum/remarks.length
        
       
        // console.log(user)
        res.json({success:true,remarks:remarks,avgRating:avgRating})
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    
})

module.exports = router;