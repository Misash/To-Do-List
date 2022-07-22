
const bodyParser = require('body-parser');
const express = require('express');
const ejs = require("ejs")
// const date = require("./date.js")
const mongoose = require('mongoose');
const _ = require("lodash")

const app = express()
var port = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

app.set("view engine","ejs")


// mongoose.connect('mongodb://localhost:27017/todoListDB', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect('mongodb+srv://misash:admin@cluster0.fqxyd.mongodb.net/?retryWrites=true&w=majority')
    .then((db)=>{
        console.log("DB connected")
    })
    .catch((err)=>{
        console.log(err)
    })



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

const listSchema = {
    name: String ,
    items: [itemsSchema]
}

const List = mongoose.model("List",listSchema)


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

app.get("/:customListName",(req,res)=>{

    const customListName = _.capitalize(req.params.customListName)

    List.findOne({name: customListName },(err,foundList)=>{
        if(!foundList)
        {
            const list = new List({
                name: customListName ,
                items: defaultItems
            })
            list.save()
            res.redirect("/"+customListName)
        }else
        {
            console.log(foundList.name)
            res.render('list', { day: foundList.name, items: foundList.items});
        }
    })

})





app.post("/",(req,res)=>{

    console.log(req.body)

    const itemName = req.body.newItem
    const listName = req.body.list

    const item = new Item({
        name: itemName
    })

    if(listName === "Today")
    {
        item.save()
        res.redirect("/")
    }else
    {

        List.findOneAndUpdate( {name: listName} ,{$push : {items: item}},
            (err,succ)=>{
                if(err){
                    console.log(err)
                }else{
                    console.log(succ)
                }
            })
        res.redirect("/" + listName)
    }

})


app.post("/delete",(req,res)=>{

    console.log(req.body)

    const itemId = req.body.itemId
    const listName = req.body.listName


    if(listName === "Today")
    {
        Item.remove({_id: itemId} ,(err)=>{
            if(!err){
                console.log("1 document deleted")
            }else{
                console.log(err)
            }
        })
        res.redirect("/")
    }else
    {
        List.findOneAndUpdate( {name: listName} ,{$pull : {items: { _id: itemId} }},
            (err)=>{
                if(err){
                    console.log(err)
                }else{
                    console.log("1 document deleted")
                }
            })
        res.redirect("/" + listName)
    }

})


app.listen(port || process.env.PORT, () => {
    console.log(`server started on port ${port}`)
})