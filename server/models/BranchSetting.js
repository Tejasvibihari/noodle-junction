import mongoose from "mongoose";

const branchSettingSchema = new mongoose.Schema(
    {
        branchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch",
            required: true,
            unique: true,
            index: true,
        },

        isOpen: {
            type: Boolean,
            default: true,
        },

        openingTime: {
            type: String,
            default: "10:00",
        },

        closingTime: {
            type: String,
            default: "22:00",
        },

        preparationTime: {
            type: Number,
            default: 30,
        },

        acceptOrders: {
            type: Boolean,
            default: true,
        },

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
    {
        timestamps: true,
    }
);

export default mongoose.model(
    "BranschSetting",
    branchSettingSchema
);