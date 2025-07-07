import express from 'express'
import{  
    adEnorlment,
    getEnrolment,
    deleteEnrolment
}
 from '../controller/Enrolment.js'
import { protect } from '../middlewares/auth.middlewere.js'

const router = express.Router()

router.use(protect)

router.post('/' ,adEnorlment)
router.get('/' ,getEnrolment)
router.delete('/:enrolId',deleteEnrolment)

export default router