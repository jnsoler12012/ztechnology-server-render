import { Role, User } from '../../models/index.js'
import errorController from '../errorController.js'

export default async (req, res) => {
    console.log("=====_____Peticion recibida para eliminar", req.body)

    const { names, document, email, idRequired, state, roleId } = req.body

    let attrGet = {}

    if (idRequired)
        attrGet['id'] = idRequired

    if (names)
        attrGet['names'] = names

    if (document)
        attrGet['document'] = document

    if (email)
        attrGet['email'] = email

    if (roleId)
        attrGet['roleId'] = roleId

    if (state !== null)
        attrGet['state'] = state

    try {
        const user = await User.findAll({
            attributes: { exclude: ['password', 'retriesPassword', 'timerDisableAccount'] },
            where: {
                ...attrGet
            },
            include: [
                { model: Role, attributes: { exclude: ['createdAt', 'updatedAt', 'id'] } }
            ],
        })
        console.log(attrGet);

        if (!user || user.length == 0)
            throw {
                message: "There are no user/s with the attributes searched",
                status: 400,
                path: attrGet
            }

        return res.status(200).json({
            success: true,
            message: "User/s with desired search are those",
            data: user
        })
    } catch (error) {
        if (!error.status)
            error['status'] = 405

        return errorController(error, res)
    }
}