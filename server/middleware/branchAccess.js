export const branchAccess = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required",
        });
    }

    // Restaurant owner can access all branches
    if (req.user.role === "admin") {
        return next();
    }

    // Only branch users can continue
    if (req.user.role !== "branch") {
        return res.status(403).json({
            success: false,
            message: "Branch access required",
        });
    }

    const requestedBranchId =
        req.params.branchId ||
        req.body.branchId ||
        req.query.branchId;

    if (!requestedBranchId) {
        return res.status(400).json({
            success: false,
            message: "Branch ID is required",
        });
    }

    // VERY IMPORTANT
    if (requestedBranchId.toString() !== req.user.branchId.toString()) {
        return res.status(403).json({
            success: false,
            message: "You cannot access another branch",
        });
    }

    next();
};