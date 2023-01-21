const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
require('dotenv').config();


const app = express();

// middle ware
app.use(cors());
app.use(express.json());

const bcrypt = require("bcryptjs");

const port = 3002;

// middle were
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const jwt = require("jsonwebtoken");
const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

// create product schema
const productsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  photourl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

// create slider schema
const sliderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  photourl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

// create category schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  photourl: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const UserDetailsScehma = new mongoose.Schema(
  {
    fname: String,
    lname: String,
    email: { type: String, unique: true },
    password: String,
  },
  {
    collection: "UserInfo",
  }
);

// create product model
const Product = mongoose.model("Products", productsSchema);
const Slider = mongoose.model("Sliders", sliderSchema);
const Category = mongoose.model("Categories", categorySchema);
const User = mongoose.model("UserInfo", UserDetailsScehma);


// connect database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("db is connected");
  }
  catch (error) {
    console.log("db is not connected");
    console.log(error.message);
    process.exit(1);
  }
};


app.get('/', (req, res) => {
  res.send('Welcome to Hone route');
});

// CRUD - Create, Read, Update, Delete


// Create products
app.post('/products', async (req, res) => {
  try {
    // insert single data
    const newProduct = new Product({
      name: req.body.name,
      photourl: req.body.photourl,
      description: req.body.description,
      price: req.body.price,
    });

    // save product in database
    const productData = await newProduct.save();

    res.status(201).send(productData);
  }
  catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Create slider
app.post('/sliders', async (req, res) => {
  try {
    // insert single data
    const newSlider = new Slider({
      title: req.body.title,
      photourl: req.body.photourl,
      description: req.body.description,
    });

    // save Slider in database
    const sliderData = await newSlider.save();

    res.status(201).send(sliderData);
  }
  catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Create category
app.post('/Categories', async (req, res) => {
  try {
    // insert single data
    const newCategory = new Category({
      name: req.body.name,
      photourl: req.body.photourl
    });

    // save Slider in database
    const categoryData = await newCategory.save();

    res.status(201).send(categoryData);
  }
  catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// get products 
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    if (products) {
      res.status(200).send({
        success: true,
        message: "return all products",
        data: products
      });
    }
    else {
      res.status(404).send({
        success: false,
        message: "products not found"
      });
    }
  }
  catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// get slider 
app.get("/sliders", async (req, res) => {
  try {
    const products = await Slider.find();
    if (products) {
      res.status(200).send({
        success: true,
        message: "return all products",
        data: products
      });
    }
    else {
      res.status(404).send({
        success: false,
        message: "products not found"
      });
    }
  }
  catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// get all Category 
app.get("/Categories", async (req, res) => {
  try {
    const products = await Category.find();
    if (products) {
      res.status(200).send({
        success: true,
        message: "return all products",
        data: products
      });
    }
    else {
      res.status(404).send({
        success: false,
        message: "products not found"
      });
    }
  }
  catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// get Single product 
app.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ _id: id });
    // .select({ title: 1, price: 1, _id: 0 });

    if (product) {
      res.status(200).send({
        success: true,
        message: "return single product",
        data: product
      });
    }
    else {
      res.status(404).send({
        success: false,
        message: "product was not found with this id"
      });
    }
  }
  catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// delete slider 
app.delete("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete({ _id: id });

    if (product) {
      res.status(200).send({
        success: true,
        message: "deleted single product",
        data: product
      });
    }
    else {
      res.status(404).send({
        success: false,
        message: "product was not deleted with this id"
      });
    }
  }
  catch (error) {
    res.status(500).send({ message: error.message });

  }
});

// register user 
app.post("/register", async (req, res) => {
  const { fname, lname, email, password } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.json({ error: "User Exists" });
    }
    await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

// login user 
app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User Not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: 10,
    });

    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "InvAlid Password" });
});



app.listen(port, async () => {
  console.log(`server is running ar http://localhost:${port}`);
  await connectDB();
});


// no sql data base
// DATABASE -> collection -> document