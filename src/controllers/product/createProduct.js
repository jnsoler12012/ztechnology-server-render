import { User, Product } from '../../models/index.js'
import errorController from '../errorController.js'

export default async (req, res) => {
    console.log("______Peticion recibida para crear", req.body)
    const { name, type, description, price, counterProduct, idRequester } = req.body

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
        console.log(name, type, description, price, counterProduct, idRequester);

        let product
        if (counterProduct == 0) {
            product = await Product.create({
                name, type, description, price, available: false, userId: idRequester
            })
        } else if (counterProduct == 1) {
            product = await Product.create({
                name, type, description, price, available: true, userId: idRequester
            })
        } else if (counterProduct > 1) {
            let objAttributesProduct = []

            for (let x = 0; x < counterProduct; x++)
                objAttributesProduct.push({ name, description, price, type, available: true })

            product = await Product.bulkCreate(objAttributesProduct)
        }

        return res.status(200).json({
            success: true,
            message: "Product Created successfully",
            data: product
        })

    } catch (error) {
        if (!error.status)
            error['status'] = 405

        return errorController(error, res)
    }
}