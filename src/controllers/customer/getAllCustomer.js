import { User, Customer } from '../../models/index.js'
import errorController from '../errorController.js'

export default async (req, res) => {
    console.log("=====_____Peticion recibida para modificar", req.body)
    try {
        const customer = await Customer.findAll({
            include: [
                { model: User, attributes: { exclude:  ['password', 'retriesPassword', 'timerDisableAccount', 'state', 'createdAt', 'roleId', 'updatedAt'] } }
            ],
        })

        if (!customer)
            throw {
                message: "There are no customer/s",
                status: 400,
                path: `Customers`
            }

        return res.status(200).json({
            success: true,
            message: "List Of all current customer/s",
            data: customer
        })

    } catch (error) {
        if (!error.status)
            error['status'] = 405

        return errorController(error, res)
    }
}