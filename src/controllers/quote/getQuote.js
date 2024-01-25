import { User, Product, Quote, Customer, Role } from '../../models/index.js'
import errorController from '../errorController.js'

export default async (req, res) => {
    console.log("=====_____get quote", req.body)

    const { id, description, discountType, discount, deliveryType, state, idUserRequester } = req.body

    let attrGet = {}


    if (discountType)
        attrGet['discountType'] = discountType

    if (discount)
        attrGet['discount'] = discount

    if (deliveryType)
        attrGet['deliveryType'] = deliveryType

    if (state)
        attrGet['state'] = state

    if (idUserRequester !== null)
        attrGet['userId'] = idUserRequester


    try {
        const product = await Quote.findAll({
            include: [
                {
                    model: User,
                    attributes: {
                        exclude: ['password', 'retriesPassword', 'timerDisableAccount', 'state', 'createdAt', 'updatedAt'],
                    },
                    include: {
                        model: Role,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'id'] }
                    }
                },
                { model: Customer, attributes: { exclude: ['createdAt', 'updatedAt', 'userId',] } },
                { model: Product, attributes: { exclude: ['createdAt', 'updatedAt', 'products_quotes'] } }
            ],
            where: {
                ...attrGet
            }
        })
        console.log(JSON.stringify(attrGet));

        if (!product || product.length == 0)
            throw {
                message: "There are no Quote/s with the attributes",
                status: 400,
                path: attrGet
            }

        return res.status(200).json({
            success: true,
            message: "Quote/s with desired search are those",
            data: product
        })

    } catch (error) {
        if (!error.status)
            error['status'] = 405

        return errorController(error, res)
    }
}