import jwt from "jsonwebtoken"


export default async (request, response, next) => {
    console.log("_____________");
    const SECRET_KEY = process.env.SECRET_KEY
    try {
        const token = await request.headers.authorization.split(" ")[1];
        const decodedToken = await jwt.verify(token, SECRET_KEY);
        console.log(decodedToken);
        const user = await decodedToken;
        request.user = user;

        next();

    } catch (error) {
        return response.status(401).json({
            auth: false,
            message: "ERROR - Petition over non authenticated user",
        });
    }
}
