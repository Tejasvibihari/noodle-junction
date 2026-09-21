import bcrypt from "bcrypt";
import Admin from "../../models/Admin.js";
import { generateAdminId } from "../../utils/generateAdminId.js";
import { generateToken } from "../../utils/generateToken.js";

export const adminSignup = async (req, res) => {
    console.log("Admin signup request body:", req.body);
    try {
        const {
            username,
            restaurentName,
            name,
            email,
            mobile,
            password,
            address,
        } = req.body;

        // Validate required fields
        if (
            !username ||
            !restaurentName ||
            !name ||
            !email ||
            !mobile ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields are required",
            });
        }

        // Check email
        const existingEmail = await Admin.findOne({
            email: email.toLowerCase(),
        });

        if (existingEmail) {
            return res.status(409).json({
                success: false,
                message: "Email already registered",
            });
        }

        // Check username
        const existingUsername = await Admin.findOne({
            username,
        });

        if (existingUsername) {
            return res.status(409).json({
                success: false,
                message: "Username already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Generate admin ID
        const adminId = generateAdminId();

        // Create admin
        const admin = await Admin.create({
            adminId,
            username,
            restaurentName,
            name,
            email: email.toLowerCase(),
            mobile,
            password: hashedPassword,
            address,
        });

        // Generate JWT
        const token = generateToken(admin);

        return res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            data: {
                admin: {
                    id: admin._id,
                    adminId: admin.adminId,
                    username: admin.username,
                    restaurentName: admin.restaurentName,
                    name: admin.name,
                    email: admin.email,
                    mobile: admin.mobile,
                },
                token,
            },
        });
    } catch (error) {
        console.error("Admin signup error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// Admin Login Controller 
export const adminLogin = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if ((!username && !email) || !password) {
            return res.status(400).json({
                success: false,
                message: "Username/email and password are required",
            });
        }

        // Find admin and explicitly select password
        const query = email
            ? { email: email.toLowerCase() }
            : { username };

        const admin = await Admin.findOne(query).select("+password");

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        // Compare password
        const isPasswordValid = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Generate JWT
        const token = generateToken(admin);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                admin: {
                    id: admin._id,
                    adminId: admin.adminId,
                    username: admin.username,
                    restaurentName: admin.restaurentName,
                    name: admin.name,
                    email: admin.email,
                    mobile: admin.mobile,
                    status: admin.status,
                },
                token,
            },
        });
    } catch (error) {
        console.error("Admin login error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};