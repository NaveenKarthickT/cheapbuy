import express from "express";
import db from "./db.js";
import multer from "multer";

const agent =express.Router();

const upload = multer({ dest: "images/" });

agent.get("/allUser",(req,res)=>{
    const sql = "select fullname from agents"
    db.query(sql,(err,result)=>{
        if(err){
            res.status(500).json(
                {
                    msg : "error in retrieving agents"
                }
            )
        }
        if (result.length === 0) {
             return res.status(404).json({ msg: "agent not found" })
         }
         console.log(result)
        res.json(result);
        
    })
})

agent.get("/user" , (req,res) => {
    const email = req.query.email;

    const sql = " select * from agents where email = ?";
    db.query(sql,[email],(err,result)=>{
        
        if(err){
            return res.status(500).json({msg : "database connection failed"}); 
        }
        if(result.length === 0){
            return res.status(404).json({msg : "user not found"})
        }
        res.json(result[0]);
    });
});

agent.get("/userexist" , (req,res) => {
    

    const sql = " select email from agents ";
    db.query(sql,(err,result)=>{
        
        if(err){
            return res.status(500).json({msg : "database connection failed"}); 
        }
        
        res.json(result);
    });
});

agent.post("/register" , (req,res)=>{
    const name = req.body.username;
    const email = req.body.email;
    const pass=req.body.pass;
   
    const ph=req.body.ph;
    const sql="INSERT INTO agents (fullname , email , password,phone) VALUES (?,?,?,?)"
    db.query(sql,[name,email,pass,ph],(err,result)=>{
        if(err){
            return res.status(500).json({msg : "registration failed"});
        }
        res.json({msg:"registrtion successfull"});
    })
}) 

agent.post("/assignitems",(req,res)=>{
    const email = req.body.seller_email ;
    const prodname = req.body.productName;
    const order_id = req.body.order_id;
    const agentName = req.body.agentName;
    const path = req.body.path;
    const address = req.body.address;
    const sql = "insert into assigneditems (product_name , agent_name , seller_email , order_id ,prod_path , address) values (?,?,?,?,?,?)"
    db.query(sql , [prodname ,agentName,email,order_id,path,address],(err,result)=>{
        if(err){
            console.log(err)
             return res.status(500).json({msg :  err.message})
        }
        res.json({
            msg : "assigned"
        })
    })
})
agent.get("/assigneditems", (req, res) => {
    const agentEmail = req.query.email;

    if (!agentEmail) {
        return res.status(400).json({ msg: "Agent email is required" });
    }

    const sql = `
        SELECT ai.product_name, ai.order_id ,ai.prod_path , ai.address
        FROM assigneditems ai
        JOIN agents a ON ai.agent_name = a.fullname
    
        WHERE a.email = ?
    `;

    db.query(sql, [agentEmail], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ msg: "Failed to fetch assigned items" });
        }

        res.json(result);
    });
});











export default agent;