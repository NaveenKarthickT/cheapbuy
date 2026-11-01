import express from "express";
import cors from "cors";
import db from "./db.js";
import multer from "multer";
import seller from "./seller.js";
import agent from "./Agent.js"

const app =express();
app.use("/images", express.static("images"));
app.use(cors());

app.use(express.json());
const upload = multer({ dest: "images/" });

app.use("/seller",seller)
app.use("/agent",agent)
app.get("/userexist" , (req,res) => {
    

    const sql = " select email from dealers ";
    db.query(sql,(err,result)=>{
        
        if(err){
            return res.status(500).json({msg : "database connection failed"}); 
        }
        if(result.length === 0){
            return res.status(404).json({msg : "user not found"})
        }
        res.json(result);
    });
});

app.get("/user" , (req,res) => {
    const email = req.query.email;

    const sql = " select * from users where email = ?";
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

app.post("/register" , (req,res)=>{
    const name = req.body.username;
    const email = req.body.email;
    const pass=req.body.pass;
    const cartCount = req.body.cartCount;
    const sql="INSERT INTO users (names , email , password,cartCount) VALUES (?,?,?,?)"
    db.query(sql,[name,email,pass,cartCount],(err,result)=>{
        if(err){
            return res.status(500).json({msg : "registration failed"});
        }
        res.json({msg:"registrtion successfull"});
    })
}) 

app.post("/forgetpass" ,(req,res)=>{
    const newpass=req.body.newpass;
    const uname=req.body.uname;
    const sql ="UPDATE users SET password = ? WHERE email=?"
    db.query(sql,[newpass,uname],(err,result)=>{
        console.log(result)
        if(err){
             return res.status(500).json({msg : "db failed"});
        }
        if(result.affectedRows === 0){
            return res.status(404).json({msg : "email id not matched.enter a valid email"})
        }
        res.json({msg : "password changed successfully!"})
    })
    
})

app.get("/products", (req, res) => {

    const sql = "SELECT * FROM products";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                msg: "Database error"
            });
        }

        res.json(result);
    });
});

app.post("/uploadphotos", upload.single("image"), (req, res) => {

    const prodname = req.body.prodname;
    const price = req.body.price;
    const description = req.body.description;
    const discount=req.body.discount;
    const image = req.file.path;
    const email = req.body.email;
    const availQuan = req.body.availQuan;

    const sql = `
        INSERT INTO products
        (name, price, description, path,seller_email,discount,available_quantity)
        VALUES (?, ?, ?, ?,?,?,?)
    `;

    db.query(
        sql,
        [prodname, price, description, image,email,discount,availQuan],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    msg: "Product insertion failed"
                });
            }

            res.json({
                msg: "Product added successfully"
            });
        }
    );
});

app.post("/editProducts" , (req,res)=>{
    const changedProdName = req.body.changedProdName;
    const changedPrice = req.body.changedPrice;
    const changedDes=req.body.changedDes;
    const actualName =req.body.productName;
    console.log(actualName)
    const sql = "UPDATE  products set name = ? ,price = ? , description=? where name = ?"
    db.query(sql , [changedProdName , changedPrice , changedDes , actualName],(err,result) =>{
        if(err){
            return res.status(500).json({
                msg : "product updation failed",
                 error: err.message
            })
        }
        
        res.json({
            msg : "Updated Successfully"
        })
    })
})

app.post("/cart" , (req,res)=>{
    const username = req.body.username;
    const productName = req.body.productName;
    const quantity = req.body.quantity;
    const email =req.body.email;
    const cartCount=req.body.cartCount;
    const sql = "INSERT INTO cart (name,productname,quantity,email,cartCount) VALUES (?,?,?,?,?)"
    db.query(sql,[username,productName,quantity,email,cartCount],(err,result) =>{
        if(err){
            return res.status(500).json({
                msg:"add to cart failed"
            })

        }
        res.json({
            msg:"added to cart"
        })
    })
})

app.get("/cart" , (req,res)=>{
    const email = req.query.email;
    
    const sql="select products.name , products.price , products.description , products.path , products.rating , products.discount ,cart.quantity from cart LEFT JOIN products ON cart.productname = products.name where cart.email = ?"
    db.query(sql , [email],(err,result)=>{
        if(err){
            return res.status(500).json({
                msg:"retrieve failed"
            })
        }
        res.json(result)
        console.log(result[0])
    })
})

app.get("/paymentProducts",(req,res) =>{
    const prodname = req.query.name;
    
    const sql="select * from products where name=?"
    db.query(sql,[prodname],(err,result)=>{
        if(err){
            return res.status(500).json({
                msg:"order failed"
            })
        
        }
        res.json(result[0])
        
    })
})

app.post("/deletecart" , (req,res)=>{
    const username = req.body.username;
    const productName = req.body.productName;
    const sql = "delete from cart where name=? and productname=?"
    db.query(sql , [username,productName],(err,result)=>{
        if(err){
            return res.status(500).json({
                msg : "cant able to delete"
            })
        }
        res.json({
            msg : "item deleted from cart"
        })
    })
})

app.post("/addquan" , (req,res)=>{
    const email =req.query.email;
    const sql = "update users set cartCount = cartCount+1 where email =?"
    db.query(sql,[email],(err,result)=>{
        if(err){
            return res.status(500).json({
                msg:"error"
            })
        }
        res.json({
            msg:"cartcount added"
        })
    })
})


app.get("/getquan" , (req,res)=>{
    const email =req.query.email;
    const sql = "select cartCount from users where email =? limit 1"
    db.query(sql,[email],(err,result)=>{
        if(err){
            return res.status(500).json({
                msg:"error"
            })
        }
        res.json(result[0])
    })
})

app.post("/delquan" , (req,res) =>{
    const email = req.query.email;
    const sql = "update users set cartCount = cartCount-1 where email =?"
    db.query(sql,[email],(err,result)=>{
        if(err){
            return res.status(500).json({
                msg:"error"
            })
        }
        res.json({
            msg:"cartcount deleted"
        })
    })
})




seller.post("/order", (req, res) => {
    const { email, products } = req.body;

    if (!email || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
            msg: "Email and products are required"
        });
    }

    const values = products.map(product => [
        email,
        product.name,
        product.quantity || 1
    ]);

    const sql = `
        INSERT INTO orders (email, productname, quantity)
        VALUES ?
    `;
        db.query(sql, [values], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                msg: "Failed to save order"
            });
        }

        res.status(201).json({
            msg: "Order placed successfully!"
        });
    });

});

app.get("/checkAddress" ,(req,res)=>{
    const email=req.query.email;

    const sql="select * from addresses where email = ?"

    db.query(sql,[email],(err,result)=>{

        if (err) {
            console.log(err)
            return res.status(500).json({
                msg: "Failed to retrieve"
            });
        }

        if(result.length === 0){
            return res.status(404).json({
                msg : "Address not found"
            })
        }

        res.json(result[0])
    })
})
app.get("/checkAddressSeller" ,(req,res)=>{
    const email=req.query.email;
    const sql="select products.name , users.email as uemail ,users.names ,products.path,addresses.address , orders.id from orders join users on users.email = orders.email join products on orders.productname = products.name join addresses on orders.email = addresses.email where seller_email =?"

    db.query(sql,[email],(err,result)=>{
         if (err) {
            console.log(err)
            return res.status(500).json({
                msg: "Failed to retrieve"
            });
        }
        console.log(`result: ${result}`)
        if(result.length === 0){
            return res.json({fullname :"none" , address : "none"})
        }

        res.json(result)
    })
})


app.post("/addAddress" , (req,res)=>{
    const fullname = req.body.fullname;
    const email = req.body.email;
    const phno = req.body.phno;
    const address =req.body.address;
    const city = req.body.city;
    const pincode=req.body.pincode;

    const sql = "INSERT INTO addresses (email, fullname, phone, address, city, pincode) VALUES (?,?,?,?,?,?)"
    db.query(sql , [email,fullname,phno,address,city,pincode] , (err,result) =>{
        if(err){
            console.log(err)
            return res.status(500).json({
                msg : "error"
            })
        }
        res.status(200).json(
            {
                msg : "address saved"
            }
        )
    })
})
app.post("/updateAddress" , (req,res)=>{
    const fullname = req.body.fullname;
    const email = req.body.email;
    const phno = req.body.phno;
    const address =req.body.address;
    const city = req.body.city;
    const pincode=req.body.pincode;

    const sql ="update addresses set fullname= ? , phone=? , address = ? , city = ? , pincode=? where email = ?"

    db.query(sql , [fullname,phno,address,city,pincode,email] , (err,result) =>{

        if(err){
            console.log(err)
            return res.status(500).json({
                msg : "error"
            })
        }

        if(result.affectedRows === 0){
            return res.status(404).json({
                msg : "Address not found"
            })
        }

        res.status(200).json(
            {
                msg : "address updated"
            }
        )
    })
})

app.get("/getName" , (req,res)=>{
    const email = req.query.email;

    const sql = "select names from users where email = ?"

    db.query(sql , [email],(err,result)=>{

        if(err){
            return res.status(500).json(
                {
                    msg : "error"
                }
            )
        }

        if(result.length === 0){
            return res.status(404).json({
                msg : "User not found"
            })
        }

        res.json({
            names: result[0].names
        });
    })
})

app.get("/getOrders" , (req,res)=>{
    const email = req.query.email;
    const sql = "SELECT * from orders join products on orders.productname = products.name where email = ?"
    db.query(sql , [email] , (err,result)=>{
        if(err){
            return res.status(500).json(
                {
                    msg : "error"
                }
            )
        }
        res.json(result)
    })
})

app.get("/getOrdersStatus" , (req,res)=>{
    const email = req.query.email;
    const prod = req.query.prod;
    const sql = "select status from orders where email =? and productname =?"
    db.query(sql , [email , prod] , (err,result)=>{
        if(err){
            return res.status(500).json(
                {
                    msg : "error"
                }
            )
        }
        res.json(result[0])
    })
})

app.get("/updateStatus" , (req,res)=>{
    const email = req.query.email;
    const prod = req.query.prod;
    const sql="update orders set status = 'shipped' where email = ? and productname = ?"
    db.query(sql , [email , prod] , (err,result)=>{
        if(err){
            return res.status(500).json(
                {
                    msg : "error"
                }

            )
        }
        console.log(result)
         res.status(200).json(result)
    })
})

app.listen(5000 , ()=>{
    console.log("running");
});