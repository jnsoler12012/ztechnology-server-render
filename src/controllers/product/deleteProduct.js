import { Product } from '../../models/index.js'
import errorController from '../errorController.js'

export default async (req, res) => {
    console.log("=====_____Peticion recibida para eliminar producto", req.body)

    let idRequired = req.params?.idProduct

    try {
        const productRequired = await Product.findOne({
            where: {
                id: idRequired
            }
        })

        if (!productRequired)
            throw {
                message: "Requested Product to delete does not exists",
                status: 400,
                path: `IdProductRequested ${idRequired}`
            }


        await Product.destroy({
            where: { id: idRequired }
        })

        return res.status(200).json({
            success: true,
            message: "Product deleted succesfully"
        })

    } catch (error) {
        if (!error.status)
            error['status'] = 405

        return errorController(error, res)
    }
}