
const bodyParser = require('body-parser');
const express = require('express');
const ejs = require("ejs")

const app = express()
var port = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

app.set("view engine","ejs")



var items = ["buy food" , "cook food" , "eat food"]


app.get("/", (req, res) => {

    var today = new Date()
  
    var options = {
        weekday: "long" ,
        day: "numeric" ,
        month: "long" 
    }

    var day = today.toLocaleDateString("en-US",options)

    res.render('list', { day: day , items: items});

})


app.post("/",(req,res)=>{
    var item = req.body.newItem
    items.push(item)
    res.redirect("/")
})




app.listen(port, () => {
    console.log(`server started on port ${port}`)
})