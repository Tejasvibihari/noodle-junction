import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
    {
        branchId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
            index: true,
        },

        branchName: {
            type: String,
            required: true,
            trim: true,
        },
        owberName: {
            type: String,
            required: true,
            trim: true,
        },
        mobile: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
        },

        address: {
            street: {
                type: String,
                required: true,
            },

            city: {
                type: String,
                required: true,
            },

            state: {
                type: String,
                required: true,
            },

            pincode: {
                type: String,
                required: true,
            },

            landmark: {
                type: String,
            },
        },
        role: {
            type: String,
            enum: ["branch"],
            default: "branch",
        },

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Branch", branchSchema);