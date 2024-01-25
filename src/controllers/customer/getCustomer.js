import { User, Customer } from '../../models/index.js'
import errorController from '../errorController.js'

export default async (req, res) => {
    console.log("=====_____Peticion recibida para modificar", req.body)

    const { names, document, email, city, address, phone, idRequired, userId } = req.body

    let attrGet = {}

    if (idRequired)
        attrGet['id'] = idRequired

    if (names)
        attrGet['names'] = names

    if (document)
        attrGet['document'] = document

    if (email)
        attrGet['email'] = email

    if (city)
        attrGet['city'] = city

    if (address)
        attrGet['address'] = address

    if (phone)
        attrGet['phone'] = phone

    if (userId)
        attrGet['userId'] = userId


    try {
        const customer = await Customer.findAll({
            include: [
                { model: User, attributes: { exclude: ['password', 'retriesPassword', 'timerDisableAccount', 'state'] } }
            ],
            where: {
                ...attrGet
            }
        })
        console.log(JSON.stringify(attrGet));

        if (!customer || customer.length == 0)
            throw {
                message: "There are no Customer/s with the attributes",
                status: 400,
                path: attrGet
            }

        return res.status(200).json({
            success: true,
            message: "Customer/s with desired search are those",
            data: customer
        })

    } catch (error) {
        if (!error.status)
            error['status'] = 405

        return errorController(error, res)
    }
}