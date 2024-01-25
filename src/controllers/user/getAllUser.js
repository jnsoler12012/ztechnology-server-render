import { Role, User } from '../../models/index.js'
import errorController from '../errorController.js'

export default async (req, res) => {
    console.log("=====_____Peticion recibida para eliminar", req.body)

    try {
        const users = await User.findAll({
            attributes: { exclude: ['password', 'retriesPassword', 'timerDisableAccount'] },
            include: [
                { model: Role, attributes: { exclude: ['createdAt', 'updatedAt', 'id'] } }
            ],
        })
        //console.log(users);

        if (!users)
            throw {
                message: "There are no user/s",
                status: 400,
                path: `Users`
            }

        return res.status(200).json({
            success: true,
            message: "List Of all current users",
            data: users
        })


    } catch (error) {
        if (!error.status)
            error['status'] = 405

        return errorController(error, res)
    }
}