const express = require('express');
const router = express.Router();
const Bid = require('../models/bids.js');
const Product = require('../models/product.js');
const { body, validationResult } = require('express-validator');

router.post('/:id', [
    body('buyer').isString().withMessage('Buyer name must be a string'),
    body('price').isInt({ min: 1 }).withMessage('Bid must be a positive integer'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const productId = req.params.id;
    const { buyer, price } = req.body;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (product.status !== 'Active') {
            return res.status(400).json({ success: false, message: 'Bidding is not active for this product' });
        }

        if (price <= product.maxBid) {
            return res.status(400).json({ success: false, message: `Your bid must be higher than the current max bid of ${product.maxBid}` });
        }

        const bid = await Bid.create({
            buyer,
            price,
            product: productId
        });

        product.maxBid = price;
        await product.save();

        res.json({ success: true, message: 'Bid placed successfully', maxBid: product.maxBid });

    } catch (error) {
        console.error('Error placing bid:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
router.get('/highest-bid/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        // Find the highest bid for the product
        const highestBid = await Bid.findOne({ product: productId })
                                    .sort({ price: -1 }) // Sort bids in descending order by price
                                    .exec();

        if (!highestBid) {
            return res.status(404).json({ success: false, message: 'No bids found for this product' });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({
            success: true,
            highestBid: {
                buyer: highestBid.buyer,
                price: highestBid.price,
                product: product.productName 
            }
        });

    } catch (error) {
        console.error('Error fetching highest bid:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router;
