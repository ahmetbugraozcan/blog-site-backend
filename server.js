const express = require('express');
const app = express();

var cors = require('cors')

app.use(cors())

app.listen(9000, ()=> {
    console.log("Listening port 9000");
});
app.get("/", (req,res)=>{
    res.send({name: "ahmet"});
})
