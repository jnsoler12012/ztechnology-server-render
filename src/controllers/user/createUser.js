import { User, Role } from '../../models/index.js'
import bcrypt from 'bcrypt'
import errorController from '../errorController.js'

export default async (req, res) => {
    console.log("Peticion recibida para crear", req.body)
    const { names, document, email, password, role, state, idRequester } = req.body

    try {
        const userRequester = await User.findOne({
            where: {
                id: idRequester
            },
            include: [
                { model: Role, attributes: { exclude: ['createdAt', 'updatedAt', 'id'] } }
            ],
        })

        if (userRequester?.dataValues?.role?.dataValues?.name == 'USER')
            throw {
                message: "User has no priviligies to create another user, only ADMIN can",
                status: 400,
                path: `Role ${userRequester?.dataValues?.role?.dataValues?.name }`
            }

        const userEmail = await User.findAll({
            where: {
                email: email
            }
        })

        if (userEmail.length > 0) {
            throw {
                message: "Email already taken",
                status: 400,
                path: `Email ${email}`
            }
        } else {
            const userRole = await Role.findAll({
                where: {
                    name: role
                }
            })

            if (userRole.length == 0)
                throw {
                    message: "Role Does no exist",
                    status: 400,
                    path: `Role ${role}`
                }

            const hashedPassword = await bcrypt.hash(password, 10);

            console.log(hashedPassword)

            const created = await User.create({
                names, document, email,
                password: hashedPassword, state,
                roleId: userRole[0].dataValues.id,
                retriesPassword: 3,
                timerDisableAccount: new Date().addMinutes(-20)
            })

            return res.status(200).json({
                success: true,
                message: "User Created successfully",
                data: created
            })
        }


    } catch (error) {
        if (!error.status)
            error['status'] = 405

        return errorController(error, res)
    }
}