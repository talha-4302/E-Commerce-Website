import mongoose from "mongoose"

const connectDB = async () => {
    try {
        console.log('HIII')

        await mongoose.connect(
            "mongodb+srv://muhammadtalhafd:talhafahad@cluster0.ljh2okt.mongodb.net/ecommerce"
        )

        console.log('DB Connected')
    } catch (error) {
        console.error("Connection failed:", error.message)
    }
}

export default connectDB;