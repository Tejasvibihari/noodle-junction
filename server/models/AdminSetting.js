import mongoose from "mongoose";

const adminSettingSchema = new mongoose.Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
            unique: true,
            index: true,
        },

        logo: {
            type: String,
        },

        currency: {
            type: String,
            default: "INR",
        },

        gstNumber: {
            type: String,
            trim: true,
        },

        taxEnabled: {
            type: Boolean,
            default: true,
        },

        orderSettings: {
            onlineOrder: {
                type: Boolean,
                default: true,
            },

            takeaway: {
                type: Boolean,
                default: true,
            },

            delivery: {
                type: Boolean,
                default: true,
            },

            cashPayment: {
                type: Boolean,
                default: true,
            },

            onlinePayment: {
                type: Boolean,
                default: true,
            },
        },

        notificationSettings: {
            newOrder: {
                type: Boolean,
                default: true,
            },

            orderCancelled: {
                type: Boolean,
                default: true,
            },
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("AdminSetting", adminSettingSchema);