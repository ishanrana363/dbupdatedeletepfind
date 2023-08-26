const express = require("express")
const mongoose = require("mongoose")
const {raw} = require("express");
const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
const Port = 3000;
const connectDB = async () =>{
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/TestDB');
        console.log("mongodb is connect")
    }catch (error){
        console.log("mongodb is not connect")
        console.log(error)
        process.exit(1)
    }
}
const userSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    price : {
        type : Number,
        required: true
    },
    rating : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true,
    },
    createAt : {
        type : Date,
        default : Date.now()
    }
})
const product = mongoose.model("ProductList",userSchema)

app.get("/",(req,res)=>{
    res.send("Welcome to my first wev server")
})

app.post("/product",async (req,res)=>{
    try {
        const title = req.body.title;
        const price = req.body.price;
        const rating = req.body.rating;
        const description = req.body.description;
        const newData = new product({
            title : title,
            price: price,
            rating: rating,
            description : description
        })

        const newAllData = await newData.save()
        res.status(201).send({
            success : true,
            message : "product create",
            newAllData
        })

    }catch (error){
        res.status(500).send({
            success : true,
            message : "Product not create"
        })
    }
})

app.get("/product", async (req,res)=>{
    try {
        const findData = await product.find();
        if(findData){
            res.status(200).send({
                success : true,
                message : "all products return",
                findData
            })
        }else {
            res.status(404).send({
                success : false,
                message : "Products not found"
            })
        }
    }catch (error){
        res.status(500).send({
            success : false,
            message : "Product not found"
        })
    }
})

app.get("/product/:id",async (req,res)=>{
    try {
        const id = req.params.id
        const findIdOneProduct = await product.find({_id : id})
        if(findIdOneProduct){
            res.status(200).send({
                success : true,
                message : "one product return",
                findIdOneProduct
            })
        }else {
            res.status(404).send({
                success : false,
                message : "Product not found"
            })
        }
    }catch (error){
        res.status(500).send({
            success : false,
            message : "enternal server error"
        })
    }
})

// app.get("/product", async (req,res)=>{
//     try {
//         const price = req.query.price;
//         const rating = req.query.rating
//         let pricepProudct;
//         if (price&&rating){
//             pricepProudct = await product.find({
//                 $and : [ {price : {$gt:price}}, { rating: { $gt : 5 } } ]
//             })
//             res.status(200).send({
//                 success : true,
//                 message : "Product return",
//                 pricepProudct
//             })
//         }else {
//             res.status(404).send({
//                 success : false,
//                 message : "Product not found"
//             })
//         }
//     }catch (error){
//         res.status(500).send({
//             success : false,
//             message : "Enternal server error"
//         })
//     }
// })

app.put("/product/:id", async (req,res)=>{
    try {
        const id = req.params.id;
        const updateData = await product.findByIdAndUpdate({
            _id : id
        },{
            $set : {
                price : 600,
                rating : 3
            }
        },{
            new : true
        })
        if(updateData){
            res.status(200).send({
                success : true,
                message : " Single product update successfully ",
                updateData
            })
        }else {
            res.status(404).send({
                success : false,
                message : " Single product not update successfully"
            })
        }
    }catch (error){
        res.status(500).send({
            success : false,
            message : error.message
        })
    }
})

app.listen(Port, async ()=>{
    console.log(`Server run successfully at http://localhost:${Port}`)
    await connectDB()
})


