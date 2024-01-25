import { User, Product } from '../../models/index.js'
import errorController from '../errorController.js'

export default async (req, res) => {
    console.log("=====_____Peticion recibida para modificar", req.body)
    try {
        const product = await Product.findAll({
            include: [
                { model: User, attributes: { exclude:  ['password', 'retriesPassword', 'timerDisableAccount', 'state', 'createdAt', 'updatedAt'] } }
            ],
        })

        if (!product)
            throw {
                message: "There are no product/s",
                status: 400,
                path: `Products`
            }

        return res.status(200).json({
            success: true,
            message: "List Of all current product/s",
            data: product
        })

    } catch (error) {
        if (!error.status)
            error['status'] = 405

        return errorController(error, res)
    }
}