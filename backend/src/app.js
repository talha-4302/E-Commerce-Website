import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/database.js';
import userRouter from './routes/user.routes.js';
import productRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';
import wishlistRouter from './routes/wishlist.routes.js';
import orderRouter from './routes/order.routes.js';
import adminRouter from './routes/admin/index.js';
import errorHandler from './middleware/errorHandler.js';

// App config
const app = express();

// db connection
connectDB();

// middleware:
// app.use: for every request, before it reaches the [final-point/when it goes to
// the response function], go through this function
app.use(cors()); // allow from all origins

app.use(express.json()); // turn request body into json(object mybe)

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/order', orderRouter);
app.use('/api/admin', adminRouter);

// response
app.get('/', (req, res) => {
    res.send("API WORKING");
});

// Must be registered last: catches errors from any catchAsync-wrapped route.
app.use(errorHandler);

export default app;
