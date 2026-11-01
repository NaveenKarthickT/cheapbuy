import express from "express";
import db from "./db.js";
import multer from "multer";

const seller =express.Router();

const upload = multer({ dest: "images/" });

seller.get("/userexist" , (req,res) => {
    

    const sql = " select email from dealers ";
    db.query(sql,(err,result)=>{
        
        if(err){
            return res.status(500).json({msg : "database connection failed"}); 
        }
        
        res.json(result);
    });
});

seller.post("/register" , (req,res)=>{
    const name = req.body.username;
    const email = req.body.email;
    const pass=req.body.pass;
    const buis=req.body.buis;
    const ph=req.body.ph;
    const sql="INSERT INTO dealers (name , email , password,business_name,phone) VALUES (?,?,?,?,?)"
    db.query(sql,[name,email,pass,buis,ph],(err,result)=>{
        if(err){
            return res.status(500).json({msg : "registration failed"});
        }
        res.json({msg:"registrtion successfull"});
    })
}) 

seller.get("/user" , (req,res) => {
    const email = req.query.email;

    const sql = " select * from dealers where email = ?";
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



seller.get("/order" , (req,res) => {
    const email = req.query.email;
    console.log(email)
    const sql = "select * from orders join products on orders.productname = products.name where products.seller_email=?";
    
    db.query(sql,[email],(err,result)=>{
        
        if(err){
            return res.status(500).json({msg : "database connection failed"}); 
        }
         
        res.json(result);
    });
   
});


seller.get("/Filterorder",(req,res)=>{
    const email = req.query.email
    const sdate = req.query.startDate
    const edate = req.query.endDate
    const sql= "select * from orders join products on orders.productname = products.name where products.seller_email=? and orders.date between ? and ?"
    db.query(sql , [email,sdate,edate] , (err,result)=>{
        if(err){
            return res.status(500).json(
                {
                    msg:"retieve failed"
                }
            )
        }
        res.json(result)
    })
})

seller.get("/Filterorderstart",(req,res)=>{
    const email = req.query.email
    const sdate = req.query.startDate

    const sql= "select * from orders join products on orders.productname = products.name where products.seller_email=? and orders.date >=?"
    db.query(sql , [email,sdate] , (err,result)=>{
        if(err){
            return res.status(500).json(
                {
                    msg:"retieve failed"
                }

            )
        }
        res.json(result)
    })
})

seller.get("/products" , (req,res)=>{
        const email = req.query.email;
        const sql = "SELECT * FROM products where products.seller_email=? ";

    db.query(sql,[email], (err, result) => {

        if (err) {
            return res.status(500).json({
                msg: "Database error"
            });
        }

        res.json(result);
    });
})

seller.post("/decreaseQuan", (req, res) => {
    const { products } = req.body;

    if (!products || products.length === 0) {
        return res.status(400).json({
            msg: "No products to update"
        });
    }

    const sql = `
        UPDATE products
        SET available_quantity = available_quantity - 1
        WHERE name = ?
    `;

    let completed = 0;

    products.forEach((product) => {
        
        db.query(
            sql,
            [product.name],
            (err, result) => {
                if (err) {
                    return res.status(500).json({
                        msg: "Failed to update quantity"
                    });
                }

                completed++;

                if (completed === products.length) {
                    return res.json({
                        msg: "Product quantities updated successfully"
                    });
                }
                console.log(`ssss${result.affectedRows}`)
            }
        );
    });
});

seller.get("/lowStock", (req, res) => {
    const email = req.query.email;

    const sql = `
        SELECT name, available_quantity
        FROM products
        WHERE seller_email = ?
        AND available_quantity <= 5
        ORDER BY available_quantity ASC
    `;

    db.query(sql, [email], (err, result) => {
        if (err) {
            return res.status(500).json({
                msg: "Failed to fetch low-stock products"
            });
        }

        res.json(result);
    });
});

seller.get("/getremainingcount" , (req,res)=>{
    const email = req.query.email
    const sql="select available_quantity from products where seller_email =?"
    db.query(sql, [email],(err,result)=>{
        if(err){
            res.status(500).json(
                {
                    msg:"error"
                }
            )
        }
        res.json(result)
    })
})


export default seller;