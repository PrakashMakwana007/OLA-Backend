import mongoose from 'mongoose'


const conectDB = async ()=>{
  
    try {
         const connect  = await mongoose.connect(`${process.env.MONGODB_URI}`)
        //  {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        // }
        console.log(`MongoDB connected: ${connect.connection.host}`)
       
    } catch (error) {  
        console.log(error , "error in db coonection")
        process.exit(1)
    }



}
export default conectDB