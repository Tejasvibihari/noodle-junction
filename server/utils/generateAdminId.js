import crypto from "crypto";

export const generateAdminId = () => {
    const randomPart = crypto
        .randomBytes(4)
        .toString("hex")
        .toUpperCase();

    return `ADM-${randomPart}`;
};