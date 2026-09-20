import jwt from "jsonwebtoken";

export const generateToken = (user) => {
    const payload = {
        userId: user._id,
        role: user.role,
    };

    // Branch user gets access only to their branch
    if (user.role === "branch") {
        payload.branchId = user.branchId;
    }

    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: "30d",
        }
    );
};