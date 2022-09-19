import db from "../database/db.js";

async function checkAuthorization(req, res, next) {
    const { authorization } = req.headers;

    try {
        const token = authorization?.replace("Bearer ", "");
        if(!token) return res.sendStatus(401);

        const session = await db.collection("sessions").findOne({ token });
        if(!session) return res.sendStatus(401);

        const user = await db.collection("users").findOne({ _id: session.userId });
        if(!user) return res.sendStatus(401);

        delete user.password;
        res.locals.user = user;
        res.locals.token = token;
        next();

    } catch(error) {
        console.error(error);
        return res.sendStatus(500);
    }
};

export { checkAuthorization };