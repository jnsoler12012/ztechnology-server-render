import { Role, User } from '../../models/index.js'
import errorController from '../errorController.js'

export default async (req, res) => {
    console.log("=====_____Peticion recibida para eliminar", req.body)

    let idRequired = req.params?.idUser
    const { idUserRequester } = req.body

    try {
        const userRequired = await User.findOne({
            where: {
                id: idRequired
            }
        })

        if (!userRequired)
            throw {
                message: "User with does not exist",
                status: 403,
                path: `Id ${idRequired}`
            }

        const userRequester = await User.findOne({
            where: {
                id: idUserRequester
            },
            include: [
                { model: Role, attributes: { exclude: ['createdAt', 'updatedAt', 'id'] } }
            ],
        })
        console.log(userRequester);

        if (!userRequester)
            throw {
                message: "User with does not exist",
                status: 403,
                path: `Id ${idRequired}`
            }
        if (userRequester?.dataValues?.role?.name !== 'ADMIN')
            throw {
                message: "User non Admin can't delete other users",
                status: 403,
                path: `Id ${idUserRequester}`
            }

        await User.destroy({
            where: { id: idRequired }
        })

        return res.status(200).json({
            success: true,
            message: "User deleted succesfully"
        })

    } catch (error) {
        if (!error.status)
            error['status'] = 405

        return errorController(error, res)
    }
}