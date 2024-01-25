import { Op } from 'sequelize'
import { Product, Quote, User } from '../../models/index.js'
import errorController from '../errorController.js'

export default async (req, res) => {
    console.log("=====_____Peticion recibida para eliminar", req.body)

    let idRequired = req.params?.idQuote

    const { idUserRequester } = req.body

    try {
        const userRequester = await User.findOne({
            where: {
                id: [idUserRequester]
            },
        })

        if (!userRequester)
            throw {
                message: "Requester User does not exists",
                status: 400,
                path: `IdUserRequester ${idUserRequester}`
            }

        const quoteRequired = await Quote.findOne({
            where: {
                id: idRequired
            },
            include: [
                { model: Product, attributes: { exclude: ['createdAt', 'updatedAt', 'products_quotes'] } }
            ]
        })

        if (!quoteRequired)
            throw {
                message: "Requested Quote to delete does not exists",
                status: 400,
                path: `IdQuoteRequested ${idRequired}`
            }

        console.log(quoteRequired);

        const products = await quoteRequired.getProducts()
        const productsId = []
        products.map(product => { productsId.push(product.dataValues.id) })

        console.log(productsId);

        const productsUpdated = await Product.update({ available: true }, {
            where: {
                id: {
                    [Op.in]: productsId
                }
            }
        })

        await Quote.destroy({
            where: { id: idRequired }
        })

        return res.status(200).json({
            success: true,
            message: "Quote deleted succesfully"
        })

    } catch (error) {
        if (!error.status)
            error['status'] = 405

        return errorController(error, res)
    }
}