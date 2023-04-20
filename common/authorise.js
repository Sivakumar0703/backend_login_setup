const bcrypt = require('bcryptjs'); // npm i bcryptjs
const saltRound = 10 ; // no.of.time to shuffle
const jwt = require('jsonwebtoken'); // npm i jsonwebtoken
const secretKey = "nefl$CJ*KLJDK#@bnK" ; // written by us


const hashPassword = async(password)=>{
let salt = await bcrypt.genSalt(saltRound);
let hashedPassword = await bcrypt.hash(password,salt);
return hashedPassword
}

const hashCompare= async(password,hashedPassword)=> { // password = req.body.password(from Application) & hashedPassword = user.password(from DB)
    return await bcrypt.compare(password,hashedPassword)

}

const createToken = async(payload)=> {   // PAYLOAD = name,email,id,role | async({name: user.name,email: user.email,id: user._id,role: user.role}) = async(payload) | payload= {name:'siva',email:'siva@gmail.com',id:'kjclkdsjjdkj45',role:'user'}
    let token = await jwt.sign(payload,secretKey,{expiresIn:'2m'})
    return token
    }

    const validate = async(req,res,next)=>{
        if(req.headers.authorization){ // req.headers.authorization => where token is located | if the token is available then proceed else end the operation('token not found')
        let token = req.headers.authorization.split(' ')[1]; // req.headers.authorization.split(' ')[1] => our token will look like ---> "bearer hkjdhsjfks64654%76jjh" => to remove the string 'bearer' and to get the actual token we use split(' ')[1]
        let data = await jwt.decode(token);
        if(Math.floor((+new Date() )/1000) < data.exp)  // +new date (change the date to number format)
         next()
        else
        res.status(401).send({message:"token expired"})
        }
        else{
        res.status(400).send({message:"token not found"})
        }
    }


    
        const adminLogin = async(req,res,next)=>{   // admin password: A454%ab
            if(req.headers.authorization){ 
            let token = req.headers.authorization.split(' ')[1]; 
            let data = await jwt.decode(token);
            if(data.role === 'admin')  
             next()
            else
            res.status(401).send({message:"token expired"})
            }
            else{
            res.status(400).send({message:"token not found"})
            }
        }

module.exports = {hashPassword,hashCompare,createToken,validate,adminLogin}

