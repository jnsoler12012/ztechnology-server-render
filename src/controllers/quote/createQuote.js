import { Op } from 'sequelize'
import { User, Product, Customer, Quote } from '../../models/index.js'
import errorController from '../errorController.js'

export default async (req, res) => {
    console.log("|||||||||||||||| CREAREMOS QUOTE", req.body)
    const { id, description, discountType, discount, total, subTotal, deliveryType, state, products, idUserRequester, emailCustomerRequester } = req.body

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

        const customerRequester = await Customer.findOne({
            where: {
                email: [emailCustomerRequester]
            },
        })

        if (!customerRequester)
            throw {
                message: "Requester Customer does not exists",
                status: 400,
                path: `EmailUserCustomer ${emailCustomerRequester}`
            }


        const productsForQuote = await Product.findAll({
            where: {
                id: {
                    [Op.in]: products
                }
            }
        })

        console.log(productsForQuote.length, products.length, userRequester, customerRequester);

        if (productsForQuote.length !== products.length)
            throw {
                message: "Required products for Quote no exist",
                status: 400,
                path: `IdProductsRequired ${products.toString()}`
            }
        else {

            const quoteCreated = await Quote.create({
                id, description, discountType, discount, total, subTotal, deliveryType, state,
                customerId: customerRequester.dataValues.id,
                userId: userRequester.dataValues.id,
            })

            const productsUpdated = await Product.update({ available: false }, {
                where: {
                    id: {
                        [Op.in]: products
                    }
                }
            })

            const productsForQuoteUpdated = await Product.findAll({
                where: {
                    id: {
                        [Op.in]: products
                    }
                }
            })

            console.log(productsUpdated, productsForQuoteUpdated);


            productsForQuoteUpdated.map((product) => {
                quoteCreated.addProduct(product)
            })
            console.log(quoteCreated);

            return res.status(200).json({
                success: true,
                message: "Quote Created successfully",
                data: quoteCreated
            })
        }

    } catch (error) {
        if (!error.status)
            error['status'] = 405

        return errorController(error, res)
    }
}