const router = require('express').Router();
const Product = require('../models/product');

const upload = require('../middlewares/upload-photo');

// const multer = require('multer');
// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, './uploads/products');
//     },
//     filename: function(req, file, cb) {
//         cb(null, new Date().toISOString() + file.originalname);
//     }  
// });
// const upload = multer({storage: storage});


// POST request - create new product
router.post('/products', upload.single('photo'), async (req, res) => {
   console.log(req.file);
    try{
        let product = new Product();
        product.owner = req.body.ownerID;
        product.category = req.body.categoryID;
        product.title = req.body.title;
        product.description = req.body.description;
        product.photo = req.file.location;
        product.price = req.body.price;
        product.stockQuantity = req.body.stockQuantity;

        await product.save();
        
        res.json({
            status: true,
            message:'Product saved successfully.'
        });
    } catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// GET request - get all products
router.get('/products', async (req, res) =>{
    try {
        let products = await Product.find()
        .populate('owner category')
        .populate('reviews', 'rating')
        .exec();

        res.json({
            status: true,
            products: products
        });
    } catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// GET request - get a single product
router.get('/products/:id', async (req, res) =>{
    try {
        let product = await Product.findOne({ _id: req.params.id })
        .populate('owner category')
        .populate('reviews', 'rating')
        .exec();

        res.json({
            status: true,
            product: product
        });
    } catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// PUT request - update a single product
router.put('/products/:id', upload.single('photo'), async(req, res) =>{
    try {
        let product = await Product.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    title: req.body.title,
                    description: req.body.description,
                    photo: req.file.location,
                    price: req.body.price,
                    stockQuantity: req.body.stockQuantity,
                    category: req.body.categoryID,
                    owner: req.body.ownerID
                }
            },
            { upsert: true }
            );

        res.json({
            status: true,
            updatedProduct: product
        });
    } catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

//DELETE request - delete a single product
router.delete('/products/:id', async (req, res) => {
    try {
        let deletedProduct = await Product.findOneAndDelete({ _id: req.params.id });

        if(deletedProduct) {
            res.json({
                status: true,
                message: 'Successfully deleted.'
            });
        }
    } catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = router;