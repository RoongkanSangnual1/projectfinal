const jwt = require('jsonwebtoken')




exports.auth =(req,res,next)=>{
    try{
        //บังคับส่งมาจากheader
        const token =req.headers['authtoken']
        if(!token){
            return res.status(401).send('no token')
        }

        const decoded = jwt.verify(token,'jwtSecret')
        req.user = decoded.user
        next()

    }  
    catch(err){
        console.log('TOKEN มั่ว')
        res.status(401).send('Tokenผิดหรือไม่มี')
    }
}