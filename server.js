import cookieParser from 'cookie-parser';
import express from 'express';
import moment from 'moment';
import bcrypt from 'bcrypt';
import mysql from 'mysql2';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import fs from 'file-system';


const app = express();
app.use(express.json());
app.use(cors(
    {
        origin:["http://localhost:5173"],
        methods: ["POST", "PUT", "GET"],
        credentials: true
    }
));
app.use(cookieParser());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "jq88esfx",
    database: "sampleadmin"
})

app.get('/', (req, res) => {
    console.log('Server connected');
    return res.json({Status: 'Server connected'})
})

app.post('/signup', (req, res) =>{
    var userId;
    const selectSql = 'SELECT * FROM sampleadmin.users ORDER BY userId DESC';
    const insertSql = 'INSERT INTO users(`userId`,`userName`,`userEmail`,`userRole`,`isUserManager`,`userPassword`, `active`,`userCreatedDate`) VALUES(?)';

    bcrypt.hash(req.body[0].userPassword,10,(err,hash)=>{
        if(err){
            writeToFile(moment().format() + 'Signup error: ' + err.toString());
            return res.json({
                    Error: "Hashing password error"
                })
        }
        else{
            db.query(selectSql, (err,reslt,fields)=>{
                if(err){
                    writeToFile(moment().format()+'Signup get users' + err.toString());
                    return err;
                }
                if(reslt.length === 0){
                    userId = 1;
                }
                else{
                    userId = parseInt(reslt[0].userId) + 1;  
                }
                const values = [
                    userId,
                    req.body[0].userName,
                    req.body[0].userEmail,
                    req.body[0].userRole,
                    req.body[0].isUserManager,
                    hash,
                    1,
                    moment().format()
                ]
                db.query(insertSql, [values], (err, result) => {
                    if(err) 
                        {
                            writeToFile(moment().format()+'Signup: Creation of user FAILED!' + err);
                            return res.json({ Error: "Creation of user FAILED! "});
                        }
                    return res.json({Status: "User Successfully Created"});
                })
            })            
        }
    })
})


app.post('/login', (req, res)=>{  
    const loginSql = 'SELECT userName, userPassword FROM users WHERE userName = "'+req.body[0].userName+'"';
    const updateQuery = 'UPDATE users SET userLastLogin = "'+ moment().format() +'" WHERE userName = "'+req.body[0].userName+'"';
    db.query(loginSql, (err, rslt, fields)=>{
        if(err){
            writeToFile(moment().format()+ " >> Login: " + "Could not get users" + err.toString());
            return err;
        }
        else if(rslt.length === 0){
            writeToFile(moment().format()+ " >> Login: " + req.body[0].userName+" has not been found");
            return res.json({Status: "User Login FAILED: Username not found"});
        }
        else{           
            bcrypt.compare(req.body[0].userPassword.toString(), rslt[0].userPassword, (err, response) => {
                if(err){
                    writeToFile(moment().format()+ " >> Login: " + req.body[0].userName+" Login FAILED: Password encryption failed" + err.toString());
                    return res.json({Status: "User Login FAILED"});
                }
                if(response){
                    const name = req.body[0].userName;
                    const token = jwt.sign({name}, "jwt-secret-key", {expiresIn:"1d"});
                    res.cookie("token", token);
                    db.query(updateQuery, (err, rslt, fields)=>{
                        if(err){
                            writeToFile(moment().format()+ " >> Login: " + req.body[0].userName+" Login FAILED: Could not update user last login date" + err.toString());
                            return err;
                        }
                        else{
                            writeToFile(moment().format()+ " >> Login: " + req.body[0].userName+" Login Successful");
                            return res.json({Status: "User Login Successful"});
                        }
                    })
                }
                else{
                    writeToFile(moment().format()+ " >> Login: " + req.body[0].userName+" Login FAILED: Incorrect password");
                    return res.json({Status: "User Login FAILED: Incorrect password"});
                }
            })
        }
    })
})


app.listen(63501, () => {
    console.log("Server Is Up And Running");
})


function writeToFile(content){
    try {
        fs.open('./server_log.txt', 'a+', (err, fd) => {
            if (err) {
              console.log(err);  
            } else {
              fs.write(fd, Buffer.from(content+'\n'), (err) => {
                if (err) console.log(err);
              });
            }
          });
    } catch (err) {
        console.error(err);
    }
}
