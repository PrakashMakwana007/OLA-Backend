import express from 'express'
import{
     register,
     login,
     logout,
     getcurentuser,
     refreshAccessToken,
     changePassword
    
} from '../controller/user.controler.js'

import {protect} from '../middlewares/auth.middlewere.js'


const router = express.Router()

router.post('/register',register) 
router.post('/login',login)  
router.post('/logout',protect,logout)
router.get('/current',protect,getcurentuser)
router.post('/refresh',refreshAccessToken)
router.post('/change-password',protect,changePassword)

export default router