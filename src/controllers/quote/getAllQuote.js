import { User, Product, Quote, Customer, Role } from '../../models/index.js'
import errorController from '../errorController.js'

export default async (req, res) => {
    console.log("|||||||| GET ALL QUOTES", req.body)
    try {
        const quote = await Quote.findAll({
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
                { model: Customer, attributes: { exclude: ['createdAt', 'updatedAt', 'userId', ] } },
                { model: Product, attributes: { exclude: ['createdAt', 'updatedAt', 'products_quotes'] } }
            ],
        })

        if (!quote)
            throw {
                message: "There are no quote/s",
                status: 400,
                path: `Quotes`
            }

        return res.status(200).json({
            success: true,
            message: "List Of all current quote/s",
            data: quote
        })

    } catch (error) {
        console.log(error);
        if (!error.status)
            error['status'] = 405

        return errorController(error, res)
    }
}