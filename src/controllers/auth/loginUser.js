import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import errorController from '../errorController.js'
import { Role, User } from '../../models/index.js'

export default async (req, res) => {
    const SECRET_KEY = process.env.SECRET_KEY
    const BAN_TIME = parseInt(process.env.BAN_TIME)

    console.log("Peticion recibida", req.body, BAN_TIME, typeof BAN_TIME, process.env.BAN_TIME)
    const { email, password } = req.body
    const requestedLoginDate = new Date()

    try {
        if (!email && !password)
            throw {
                message: "Email and password not present",
                status: 400,
                path: `Email ${email},Password ${password}`
            }

        const login = await User.findOne({
            where: {
                email
            },
            include: [
                { model: Role, attributes: { exclude: ['createdAt', 'updatedAt', 'id'] } }
            ],
        })

        if (!login)
            throw {
                message: "User Email does not exists",
                status: 400,
                path: `Email ${email}`
            }

        if (
            (requestedLoginDate < login?.dataValues?.timerDisableAccount) ||
            (login?.dataValues?.state == false)
        ) {
            const differenceTimeMin = parseInt(requestedLoginDate.minutesDiff(login?.dataValues?.timerDisableAccount))

            throw {
                message: `User is banned for ${differenceTimeMin} minutes, please wait or contact your admin`,
                status: 400,
                path: `StateUser ${login?.dataValues?.state},RetriesPassword ${login?.dataValues?.retriesPassword}`
            }
        }

        bcrypt.compare(password, login?.dataValues?.password)
            .then(async (verification) => {
                if (!verification) {
                    if (login?.dataValues?.retriesPassword == 1) {
                        const dateTimeAfterMin = requestedLoginDate.addMinutes(BAN_TIME)

                        await User.update({
                            state: false,
                            timerDisableAccount: dateTimeAfterMin,
                            retriesPassword: 3
                        }, {
                            where: {
                                id: login?.dataValues?.id
                            }
                        })

                        throw {
                            message: `User has been banned for ${BAN_TIME} minutes. Please wait or contact your ADMIN`,
                            status: 401,
                            path: `RetriesPasswordLeft 0`
                        }
                    }

                    await User.update({
                        retriesPassword: login?.dataValues?.retriesPassword - 1
                    }, {
                        where: {
                            id: login?.dataValues?.id
                        }
                    })
                    throw {
                        message: `Invalid - Incorrect password, only ${login?.dataValues?.retriesPassword - 1} tries left`,
                        status: 401,
                        path: `Password`
                    }
                }
                console.log(login?.dataValues?.state, login?.dataValues?.retriesPassword);
                const token = jwt.sign(
                    {
                        userId: login.dataValues.id,
                        useremail: login.dataValues.email
                    },
                    SECRET_KEY,
                    { expiresIn: "2d" }
                )

                const { id, names, document, email, state, roleId, role, createdAt} = login.dataValues

                const userUpdated = User.update({
                    state: true,
                    timerDisableAccount: requestedLoginDate.addMinutes(-20),
                    retriesPassword: 3
                }, {
                    where: {
                        id: login?.dataValues?.id
                    }
                })

                return res.status(200).json({
                    success: true,
                    message: "Login Succeess",
                    token: token,
                    data: {
                        user: {
                            id, names, document, email, state, role: role?.name, createdAt
                        }
                    }
                })
            })
            .catch((error) => {
                if (!error.status)
                    error['status'] = 405

                return errorController(error, res)
            })

    } catch (error) {
        console.log("______________________________", error);
        if (!error.status)
            error['status'] = 405

        return errorController(error, res)
    }
}
