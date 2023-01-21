const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const productSchema = require('../schemas/productSchema');
const Product = new mongoose.model("Product", productSchema);

// get all the products
router.get('/', (req, res) => {
  Product.find()
    // .limit(2)
    .exec((err, data) => {
      if (err) {
        res.status(500).json({
          error: "There was a server side error"
        });
      }
      else {
        res.status(200).json({
          results: data,
          message: "Success"
        });
      }
    });
});


// post a product
router.post('/', (req, res) => {
  const newProduct = new Product(req.body);
  newProduct.save((err) => {
    if (err) {
      res.status(500).json({
        error: "There was a server side error"
      });
    }
    else {
      res.status(200).json({
        message: "Product was inserted successfully"
      });
    }
  });
});




module.exports = router;