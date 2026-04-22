import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/database.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
//App config
const app = express()

const port = process.env.PORT || 4000


//db connection
connectDB();


//middleware:

//  app.use: for every request ,before it reaches the [final-point/when it goes to 
// the response function],go through this function 
app.use(cors()) //allow from all origins

app.use(express.json()) //turn request body into json(object mybe)

app.use('/api/user', userRouter)
app.use('/api/product', productRouter)




//response
app.get('/', (req, res) => {
    res.send("API WORKING")
})



app.listen(port, () => console.log('Server started on PORT: ' + port))