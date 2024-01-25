import { User, Product } from '../../models/index.js'
import errorController from '../errorController.js'

export default async (req, res) => {
    console.log("=====_____Peticion recibida para modificar", req.body)

    const { name, type, description, price, available, idRequired } = req.body

    let attrGet = {}

    if (idRequired)
        attrGet['id'] = idRequired

    if (name)
        attrGet['name'] = name

    if (type)
        attrGet['type'] = type

    if (price)
        attrGet['price'] = price

    if (description)
        attrGet['description'] = description

    if (available)
        attrGet['available'] = available


    try {
        const product = await Product.findAll({
            include: [
                { model: User, attributes: { exclude: ['password', 'retriesPassword', 'timerDisableAccount', 'state', 'createdAt', 'updatedAt'] } }
            ],
            where: {
                ...attrGet
            }
        })
        console.log(JSON.stringify(attrGet));

        if (!product || product.length == 0)
            throw {
                message: "There are no Product/s with the attributes",
                status: 400,
                path: attrGet
            }

        return res.status(200).json({
            success: true,
            message: "Product/s with desired search are those",
            data: customer
        })

    } catch (error) {
        if (!error.status)
            error['status'] = 405

        return errorController(error, res)
    }
}