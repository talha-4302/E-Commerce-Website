import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/database.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import wishlistRouter from './routes/wishlistRoute.js';
import orderRouter from './routes/orderRoute.js';
import adminRouter from './routes/adminRoute.js';
//App config
const app = express()

const port = process.env.PORT

//db connection
connectDB();


//middleware:

//  app.use: for every request ,before it reaches the [final-point/when it goes to 
// the response function],go through this function 
app.use(cors()) //allow from all origins

app.use(express.json()) //turn request body into json(object mybe)

app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/wishlist', wishlistRouter)
app.use('/api/order', orderRouter)
app.use('/api/admin', adminRouter)




//response
app.get('/', (req, res) => {
    res.send("API WORKING")
})



app.listen(port, () => console.log('Server started on PORT: ' + port))