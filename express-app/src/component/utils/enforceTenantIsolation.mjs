import Tenant from "../../mongoose/schemas/tenant.mjs";

export const enforceTenantIsolation = async (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        console.log('User is not authenticated.');
        return res.status(401).json({ message: "User is not authenticated." });
    }

    const userTenantId = req.user?.tenantId;
    const requestedTenantFriendlyId = req.params.tenantId || req.body.tenantId || req.query.tenantId;

    console.log(`Access attempt by user ${req.user?._id} to tenant ${requestedTenantFriendlyId}`);

    if (!requestedTenantFriendlyId) {
        console.log('Tenant ID is required but was not provided in the request.');
        return res.status(400).json({ message: "Tenant ID is required for this request." });
    }

    try {
        const tenant = await Tenant.findOne({ tenantId: requestedTenantFriendlyId });

        if (!tenant) {
            console.log(`Tenant with friendly ID ${requestedTenantFriendlyId} not found.`);
            return res.status(404).json({ message: "Tenant not found." });
        }

        if (userTenantId && tenant.tenantId && userTenantId.toString() === tenant.tenantId.toString()) {
            console.log(`User ${req.user?._id} is authorized to access tenant ${tenant.tenantId}.`);
            next();
        } else {
            console.log(`Access denied for user ${req.user?._id} to tenant ${tenant.tenantId}.`);
            return res.status(403).json({ message: "Access denied. Cross-tenant access is not allowed." });
        }
    } catch (error) {
        console.error("Error during tenant isolation check:", error);
        return res.status(500).json({ message: "Internal server error during tenant isolation check." });
    }
};

export default enforceTenantIsolation;
