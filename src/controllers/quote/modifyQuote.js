import { Op } from "sequelize";
import { Customer, Product, Quote, User } from "../../models/index.js";
import errorController from "../errorController.js";




export default async (req, res) => {
    console.log("=====_____Peticion recibida para modificar", req.body)

    const { id, description, discountType, discount, total, subTotal, deliveryType, state, products, idUserRequester, emailCustomerRequester } = req.body
    let originalIdQuote = req.params?.idQuote


    let attrModify = {}

    if (id)
        attrModify['id'] = id

    if (description)
        attrModify['description'] = description

    if (discountType)
        attrModify['discountType'] = discountType

    if (discount)
        attrModify['discount'] = discount

    if (total !== null)
        attrModify['total'] = total

    if (subTotal !== null)
        attrModify['subTotal'] = subTotal

    if (deliveryType)
        attrModify['deliveryType'] = deliveryType

    if (state)
        attrModify['state'] = state


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

        const quoteRequested = await Quote.findOne({
            where: {
                id: [originalIdQuote]
            },
        })

        if (!quoteRequested)
            throw {
                message: "Requester Quote does not exists",
                status: 400,
                path: `idQuote ${originalIdQuote}`
            }


        const productsForQuote = await Product.findAll({
            where: {
                id: {
                    [Op.in]: products
                }
            }
        })

        if (productsForQuote.length !== products.length)
            throw {
                message: "Required products for Quote no exist",
                status: 400,
                path: `IdProductsRequired ${products.toString()}`
            }

        const idProductsForQuote = productsForQuote.reduce((prev, next) => {
            prev.push(next.dataValues.id)
            return prev
        }, [])

        const productsOnQuote = await quoteRequested.getProducts()

        const idProductsOnQuote = productsOnQuote.reduce((prev, next) => {
            prev.push(next.dataValues.id)
            return prev
        }, [])
        console.log('\\\\\\\\\\\\\\\\\\\\eeeee', productsOnQuote, products, idProductsOnQuote)

        // less products than in the original quote
        if (products.length < idProductsOnQuote.length) {
            const idProductsToDeleteFromQuote = [...products, ...idProductsOnQuote].filter(element =>
                products.indexOf(element) === -1 || idProductsOnQuote.indexOf(element) === -1
            );

            const newProductsOnQuote = productsOnQuote.reduce((prev, next) => {
                if (!idProductsToDeleteFromQuote.includes(next.dataValues.id))
                    prev.push(next)
                return prev
            }, [])

            console.log(idProductsToDeleteFromQuote, newProductsOnQuote, idProductsOnQuote);

            productsOnQuote.map(async (productOnQuote) => {
                await quoteRequested.removeProduct(productOnQuote)
            })

            await Product.update({ available: true }, {
                where: {
                    id: {
                        [Op.in]: idProductsToDeleteFromQuote
                    }
                }
            })

            newProductsOnQuote.map(async (newProductOnQuote) => {
                await quoteRequested.addProduct(newProductOnQuote)
            })


            await quoteRequested.save()
            console.log(quoteRequested);
        } else if (products.length > idProductsOnQuote.length) {
            console.log("Product modified succesfully", idProductsOnQuote, idProductsForQuote);

            productsOnQuote.map(async (productOnQuote) => {
                await quoteRequested.removeProduct(productOnQuote)
            })

            await Product.update({ available: false }, {
                where: {
                    id: {
                        [Op.in]: idProductsForQuote
                    }
                }
            })

            quoteRequested.addProducts(productsForQuote)

            await quoteRequested.save()
        } else if (state == 'Canceled') {
            productsOnQuote.map(async (productOnQuote) => {
                await quoteRequested.removeProduct(productOnQuote)
            })

            await Product.update({ available: true }, {
                where: {
                    id: {
                        [Op.in]: idProductsForQuote
                    }
                }
            })

            attrModify['description'] = `Quote eliminated, products were restaured as available: ${idProductsForQuote.toString()}`
            await quoteRequested.save()
        }

        attrModify['customerId'] = customerRequester.dataValues.id

        await Quote.update({ ...attrModify }, {
            where: {
                id: originalIdQuote
            }
        })

        return res.status(200).json({
            success: true,
            message: "Product modified succesfully"
        })

    } catch (error) {
        if (!error.status)
            error['status'] = 405

        return errorController(error, res)
    }
}