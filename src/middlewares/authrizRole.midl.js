import apiError from '../utils/apiError.js'


export const authRole = (...role) =>{
    return (req ,res , next) =>{
        const userRole = req.user.role
        if(!userRole || !role.includes(userRole)){
            return next(new apiError(403,'you  are not approved for thise  role'))
        }

      next()
    }
    
}