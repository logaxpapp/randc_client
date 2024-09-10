import { Router } from "express";
import Tenant from "../mongoose/schemas/tenant.mjs";
import multer from 'multer';
import {  loggerMiddleware } from '../component/utils/middleware.mjs';
import { upload } from '../configuration/cloudinaryConfig.mjs'; 

const router = Router();
router.use(loggerMiddleware);

// Tenant API
// Tenant API
router.get("/api/tenants", async (req, res) => {
    try {
        const tenants = await Tenant.find({});
        res.json(tenants);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tenants", error: error.message });
    }
});


// Adjusted to use TenantId for individual tenant retrieval
router.get("/api/tenants/:tenantId", async (req, res) => {
    try {
        const tenant = await Tenant.findOne({ TenantId: req.params.tenantId });
        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }
        res.json(tenant);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tenant", error: error.message });
    }
});

// Assuming `upload` is your multer instance configured for file uploads
router.post("/api/tenants", upload.single('logo'), async (req, res) => {
    const { name, domain } = req.body; // Extracted from the form fields
    const logoFile = req.file; // The uploaded file information

    if (!name || !domain) {
        return res.status(400).json({ message: "Name and domain are required." });
    }

    try {
        let logoUrl = null;
        if (logoFile) {
            // Here, upload the file to Cloudinary
            const result = await cloudinary.uploader.upload(logoFile.path);
            logoUrl = result.url; // Use the URL from Cloudinary in your tenant record
        }

        const newTenant = new Tenant({ name, domain, logoUrl });
        await newTenant.save();
        res.status(201).json(newTenant);
    } catch (error) {
        res.status(500).json({ message: "Error creating tenant", error: error.message });
    }
});



// Adjusted to use TenantId for updates
router.put('/api/tenants/:tenantId', upload.single('logo'), async (req, res) => {
    const { name, domain } = req.body;
    const logoFile = req.file;
    const tenantId = req.params.tenantId;

    try {
        let logoUrlUpdate = {};
        if (logoFile) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "tenant_logos" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    });
                uploadStream.end(logoFile.buffer);
            });

            logoUrlUpdate.logoUrl = result.url;
        }

        const updatedTenant = await Tenant.findOneAndUpdate(
            { _id: tenantId },
            { $set: { name, domain, ...logoUrlUpdate } },
            { new: true }
        );

        if (!updatedTenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }
        res.json(updatedTenant);
    } catch (error) {
        console.error("Error updating tenant:", error);
        res.status(500).json({ message: "Error updating tenant", error: error.message });
    }
});


router.patch('/api/tenants/:tenantId', upload.single('logo'), async (req, res) => {
    const tenantId = req.params._id;
    const updates = req.body; // This may contain any fields that are allowed to be updated
    const logoFile = req.file; // The uploaded file information, if present

    try {
        let logoUrlUpdate = {};
        if (logoFile) {
            // Assuming logoFile is in memory storage; adjust accordingly if using disk storage
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "tenant_logos" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(logoFile.buffer);
            });

            logoUrlUpdate = { logoUrl: result.url }; // Prepare to update the logo URL
        }
        const updatedTenant = await Tenant.findOneAndUpdate(
            { tenantId: tenantId },
            { $set: { ...updates, ...logoUrlUpdate } }, // Spread operator to conditionally include logoUrl
            { new: true }
        );

        if (!updatedTenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }
        res.json(updatedTenant);
    } catch (error) {
        console.error("Error updating tenant:", error);
        res.status(500).json({ message: "Error updating tenant", error: error.message });
    }
}
);
// Adjusted to use TenantId for deletion
router.delete('/api/tenants/:tenantId', async (req, res) => {
    try {
        const tenant = await Tenant.findOneAndDelete({ TenantId: req.params._id });
        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Error deleting tenant", error: error.message });
    }
});



export default router;