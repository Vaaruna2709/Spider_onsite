const express = require('express');
const router = express.Router(); 
const Product = require("../models/product.js");
const { body, validationResult } = require('express-validator');

router.post('/',[
    body('endTime').isDate(),
    body('price').isInt(),
   
],async(req,res)=>{
    try {
        const productName = req.body.productName;
        const price = req.body.price;
        const auctionEndDate = req.body.endTime;

        const product = await Product.create({
            productName:productName,
            price:price,
            endTime:auctionEndDate
        });
        // console.log(user)
        res.json({success:true},)
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    
})
router.put('/:id',[
    body('endTime').isDate(),
    body('price').isInt(),
   
],async(req,res)=>{
    try {
        const id = req.params.id
      

        const product = await Product.findByIdAndUpdate(id,{...req.body})
        // console.log(user)
        res.json({success:true},)
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    
})
router.delete('/:id',[
    body('endTime').isDate(),
    body('price').isInt(),
   
],async(req,res)=>{
    try {
        const id = req.params.id
      

        const product = await Product.findByIdAndDelete(id)
        // console.log(user)
        res.json({success:true,deleted:true},)
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    
})

router.get('/active', async (req, res) => {
    try {
        const now = new Date();
        let activeProducts =[];
        
        const products = await Product.find();

        // Check and update status for each product
        products.forEach(async (product) => {
            if (product.startTime <= now && product.endTime > now && product.status !== 'Active') {
                product.status = 'Active';
                await product.save();
            } else if (product.endTime <= now && product.status !== 'Ended') {
                product.status = 'Ended';
                await product.save();
            }else if(product.startTime>=now){
                product.status = 'Scheduled'
                await product.save();
            }
        });
        products.forEach(async(product)=>{
            if(product.status =='Active'){
                activeProducts.push(product)
            }
        })
        res.status(200).json(activeProducts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
