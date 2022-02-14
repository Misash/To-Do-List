
const bodyParser = require('body-parser');
const express = require('express');
const ejs = require("ejs")
const date = require("./date.js")

const app = express()
var port = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

app.set("view engine","ejs")



var items = ["buy food" , "cook food" , "eat food"]


app.get("/", (req, res) => {

   const day = date.day()

    res.render('list', { day: day , items: items});

})


app.post("/",(req,res)=>{
    const item = req.body.newItem
    items.push(item)
    res.redirect("/")
})




app.listen(port, () => {
    console.log(`server started on port ${port}`)
})