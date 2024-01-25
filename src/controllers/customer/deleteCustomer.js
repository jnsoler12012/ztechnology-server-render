import { Customer } from '../../models/index.js'
import errorController from '../errorController.js'

export default async (req, res) => {
    console.log("=====_____Peticion recibida para eliminar", req.body)

    let idRequired = req.params?.idCustomer

    try {
        const customerRequired = await Customer.findOne({
            where: {
                id: idRequired
            }
        })

        if (!customerRequired)
            throw {
                message: "Requested Customer to delete does not exists",
                status: 400,
                path: `IdCustomerRequested ${idRequired}`
            }


        await Customer.destroy({
            where: { id: idRequired }
        })

        return res.status(200).json({
            success: true,
            message: "Customer deleted succesfully"
        })

    } catch (error) {
        if (!error.status)
            error['status'] = 405

        return errorController(error, res)
    }
}