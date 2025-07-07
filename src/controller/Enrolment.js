import {Enrolment} from '../models/enrolment.model.js';
import  apiResponse from '../utils/apiResponse.js';
import apiError from '../utils/apiError.js'
import asyncHandler from '../utils/asyncHandler.js'
import {Course} from '../models/course.model.js';
const adEnorlment = asyncHandler(async (req, res) => {
    const { coursId } = req.body;

    if (!coursId) {
        throw new apiError(400, 'courseId is required');
    }

    const courseExists = await Course.findById(coursId);
    if (!courseExists) {
        throw new apiError(404, 'Course not found');
    }

    const existingEnrolment = await Enrolment.findOne({
        user: req.user._id,
        course: coursId
    });

    if (existingEnrolment) {
        throw new apiError(400, "You are already enrolled in this course");
    }

    const enrol = await Enrolment.create({
        user: req.user._id,
        course: coursId
    });

    return res.status(200).json(
        new apiResponse(200, enrol, 'Enrolment created successfully')
    );
});

const getEnrolment = asyncHandler(async (req, res) => {
    const enrolments = await Enrolment.find({ user: req.user._id })
        .populate('course')
        .sort({ createdAt: -1 });

    if (!enrolments.length) {
        throw new apiError(404, 'No enrolments found');
    }

    return res.status(200).json(
        new apiResponse(200, enrolments, 'Enrolments fetched successfully')
    );
});


const deleteEnrolment = asyncHandler(async(req,res)=>{
     const {courseId} = req.params
     if(!courseId) {
          throw new  apiError(400 ,'course id is reqiried ')  
    }
    const enrol =await Enrolment.findByIdAndDelete({
         user: req.user._id,
        course: courseId,
    })
    return res.status(200).json(
      new apiResponse(  200,
        enrol,
        'endeollment deleted  success')
    )
})

export{
    adEnorlment,
    getEnrolment,
    deleteEnrolment
}