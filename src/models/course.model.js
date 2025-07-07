import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
    title :
    {
        type : String,
        required : true,
    },
    videoURL : 
    {
        type : String,
        required : true,
    },

})

const courseScema = new mongoose.Schema({
    title : 
    {
        type : String,
        required : true,
    },
    description : 
    {
        type : String,
       
    },
    thumbnail : 
    {
        type : String,
       
    },
    
    lessons : [lessonSchema],
    teacherId : 
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
},
{
    timestamps : true,
}) 

export const Course = mongoose.model('Course', courseScema);