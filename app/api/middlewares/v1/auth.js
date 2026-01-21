

const isRegisteredUserTokenIsPresentMiddleware = async (req, res, next) => {
    // console.log("Inside middleware....");
    // console.log(req.headers);
    // console.log(req.headers.authorization);
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(500).json(
                {
                    success: false,
                    message: "Authorization Token is not defined...."
                }
            );
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(500).json(
            {
                success: false,
                message: "Some error occured....",
                error
            }
        );
    }
};




export { isRegisteredUserTokenIsPresentMiddleware };