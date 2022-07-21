
const bodyParser = require('body-parser');
const express = require('express');
const ejs = require("ejs")
// const date = require("./date.js")
const mongoose = require('mongoose');

const app = express()
var port = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

app.set("view engine","ejs")


mongoose.connect('mongodb://localhost:27017/todoListDB', { useNewUrlParser: true, useUnifiedTopology: true });

const itemsSchema = {
    name: String
};

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({  
    name: "Welcome to your todolist!",
})

const item2 = new Item({
    name: "Hit the + button to add a new item."
})

const item3 = new Item({
    name: "<-- Hit this to delete an item."
})

const defaultItems = [item1 , item2 , item3]




app.get("/", (req, res) => {

    Item.find({},(err,items)=>{

        if(items.length === 0){
            Item.insertMany(defaultItems,(err)=>{
                if(err){
                    console.log(err)
                }else{
                    console.log("Successfully saved default items to DB.")
                }
            })
            res.redirect("/")
        }else{
            res.render('list', { day: "Today" , items: items});
        }
    })

})


app.post("/",(req,res)=>{

    const item = new Item({
        name: req.body.newItem
    })

    Item.create(item ,(err,res)=>{
        if(err){
            console.log(err)
        }else{
            console.log("1 document inserted.")
        }
    })
    
    // console.log(item)

    res.redirect("/")
})

app.post("/delete",(req,res)=>{

    console.log(req.body.checkbox)

    Item.remove({_id: req.body.checkbox} ,(err)=>{
        if(!err){
            console.log("1 document deleted")
        }else{
            console.log(err)
        }
    })

    res.redirect("/")
})


app.listen(port, () => {
    console.log(`server started on port ${port}`)
})