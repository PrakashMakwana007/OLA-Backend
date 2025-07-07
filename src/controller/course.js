import {Course} from '../models/course.model.js'
import  apiResponse from '../utils/apiResponse.js';
import apiError from '../utils/apiError.js'
import asyncHandler from '../utils/asyncHandler.js'

const createCourse = asyncHandler(async (req, res) => {
  console.log("req.user:", req.user);
  console.log("req.body:", req.body);
  console.log("req.file:", req.file); // single file

  const { title, description, lessons } = req.body;

  if (!title || !description || !req.file || !lessons) {
    return res.status(400).json(
      new apiResponse(400, null, 'All fields are required including a thumbnail')
    );
  }

  let parsedLessons;
  try {
    parsedLessons = JSON.parse(lessons); // Parse stringified lessons array
  } catch (error) {
    return res.status(400).json(new apiResponse(400, null, 'Invalid lessons format. Must be JSON array.'));
  }

  const thumbnailPath = req.file.path.replace(/\\/g, '/'); 

  const course = await Course.create({
    title,
    description,
    thumbnail: thumbnailPath,
    lessons: parsedLessons,
    teacherId: req.user._id,
  });
 console.log("Created course:", course);
  return res.status(201).json(
    new apiResponse(201, course, 'Course created successfully')
  );
});


const getCoures = asyncHandler(async (req ,res)=>{
    const coures = await Course.find().populate('teacherId', 'userName')

    return res.status(200).json(
        new apiResponse(200,coures,'course fetched success')
    )
})

const getCourseById = asyncHandler(async(req ,res )=>{
    const {id} = req.params

    const course = await Course.findById(id).populate('teacherId', 'userName')

    if(!course) {
        return apiError(res, 404, 'Course not found');
    }
    return res.status(200).json(
        new apiResponse(200,course,'course fetched successfully')
    )

})

const delateCourse =asyncHandler(async (req ,res )=>{
    const {id} = req.params

    const course = await Course.findByIdAndDelete(id)
    if(!course) {
        return apiError(res, 404, 'Course not found');
    }
    if (course.teacherId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this course");
  }
    
  await course.deleteOne();

  return res.status(200).json(
    new apiResponse(200 , null ,"course deleted success")
  )
})

export {
    createCourse,
    getCoures,
    getCourseById,
    delateCourse
}