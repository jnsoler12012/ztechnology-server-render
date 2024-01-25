import { User, Customer } from '../../models/index.js'
import errorController from '../errorController.js'

export default async (req, res) => {
    console.log("______Peticion recibida para crear", req.body)
    const { names, document, email, city, address, phone, idRequester } = req.body

    try {
        const userRequester = await User.findOne({
            where: {
                id: [idRequester]
            },
        })

        if (!userRequester)
            throw {
                message: "Requester User does not exists",
                status: 400,
                path: `IdUserRequester ${idRequester}`
            }

        const customer = await Customer.create({
            names, document, email, city, address, phone, userId: idRequester
        })

        return res.status(200).json({
            success: true,
            message: "Customer Created successfully",
            data: customer
        })

    } catch (error) {
        if (!error.status)
            error['status'] = 405

        return errorController(error, res)
    }
}