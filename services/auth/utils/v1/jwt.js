import JWT from "jsonwebtoken";

const SECRET = process.env.JSON_WEB_TOKEN_SECRET;

const verifyToken = (token) => {
    let valid = false;
    let payload = {};

    // console.log("Verifying Token....", token);

    if(!token) {
        return { valid, payload };
    }

    const decodeToken = JWT.verify(token, SECRET);

    if (decodeToken) {
        // const decodedData = {...decodeToken};
        // console.log("We got the decoded data: ", decodedData);
        valid = true;
        payload = decodeToken;
        // console.log("Token Verified: ", payload);
        
    }

    const result  = {
        isTokenVerified: valid,
        userData: payload,
    };

    return result;
};


const signToken = (payload) => {
    // const payload = {
    //         name: data.name,
    //         role: data.role,
    //         user_name: data.user_name,
    //         activation_status: data.activation_status,
    //         email: data.email,
    //         password: data.password,
    //         mobile_no: data.mobile_no,
    // };

    // console.log("For Payload: ", payload, " \n issuing token\n\n");

    // Creating Json Web Token for authorised User
    const signedToken = JWT.sign(payload, process.env.JSON_WEB_TOKEN_SECRET, { expiresIn: "7d" });

    return signedToken;
};

export { verifyToken, signToken };