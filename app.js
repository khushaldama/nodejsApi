const express=require("express");
const bdp=require("body-parser");
const mongoose=require("mongoose");
const ejs=require("ejs");
const { log } = require("console");

const app=express();
app.set('view engine','ejs');

app.use(bdp.urlencoded({extended:false}));
app.use(bdp.json());
app.use(express.static("public"));


mongoose.Promise=global.Promise;
mongoose.connect("mongodb://127.0.0.1:27017/Auto")
.then(success =>app.listen(3000,(msg)=>console.log("db connected")))
.catch(err=>console.log(err.message));

const AutoSchema={
    company: String,
    model: String,
    type: String,
    cid: String
};

const Auto=mongoose.model("cars",AutoSchema);
// app.get('/').then(req,res=>cars.find().then(err,auto=>res.send("hello world")));

app.get('/',async (req,res)=>{
    res.sendFile(__dirname+"/index.html");
});
app.get('/getdata',async (req,res)=>{
    const d=await Auto.find();
    res.send(d);
});

app.post('/' , (req,res)=>{
    const insobj= new Auto({
        company:req.body.company,
        model:req.body.model,
        type:req.body.type,
        cid:req.body.cid
    });
    insobj.save();
    res.send({Status:1})
})
app.delete('/:id', async function(req,res){
    // const id=req.params.id;
    // console.log(id);
    // const del= findByIdAndDelete(req.params.cid);
    // const del= await Auto.deleteOne({_id:id.toString()});
    const del=await Auto.deleteOne({cid:req.params.id});
        if(del.deletedCount==1){
            res.send("Successfully Deleted");
        }
        else{
            res.send("Something went wrong "+ err);
        }
});

app.get('/getdata/:id', async function(req,res){
    const data=await Auto.findOne({cid:req.params.id});
    res.send(data);
});

app.put('/',async (req,res)=>{
    const data=await Auto.updateOne({cid:req.body.cid},{company:req.body.company, model:req.body.model, type:req.body.type});   
    if(data.acknowledged){
        res.send(data);
    }
});

