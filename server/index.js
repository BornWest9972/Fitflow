express = require("express")
path = require('path')
require('dotenv').config()
const { ClerkExpressWithAuth, requireAuth } = require('@clerk/clerk-sdk-node')


ClerkExpressWithAuth({secretKey:process.env.CLERK_SECRET_KEY})

const app = express()

app.use(express.static(path.join(__dirname,'../client/FitFlow')))

app.use(ClerkExpressWithAuth())

app.get('/',(req,res) =>{
    res.sendFile(path.join(__dirname,'../client/FitFlow/index.html'))
})


app.listen(3000,() => {
    console.log("server started at 3000")
})


