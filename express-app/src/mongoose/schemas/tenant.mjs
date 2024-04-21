import mongoose from "mongoose";
import validator from 'validator'; // Assuming validation needs like checking URL format

const tenantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tenant name is required'],
        unique: true, // Enforces uniqueness for the tenant name
        trim: true, // Removes whitespace from both ends of a string
        lowercase: true, // Converts the name to lowercase
    },
    domain: {
        type: String,
        required: [true, 'Tenant domain is required'],
        unique: true, // Enforces uniqueness for the tenant domain
        trim: true, // Removes whitespace from both ends of a string
        lowercase: true, // Converts the domain to lowercase
        validate: [validator.isFQDN, 'Invalid domain format'] // Validates that the domain is a fully qualified domain name
    },
    logoUrl: {
        type: String,
        required: false, // Making logoUrl optional
        validate: {
            validator: function(url) {
                return !url || validator.isURL(url, { protocols: ['http','https'], require_protocol: true }); // Validates URL if provided
            },
            message: 'Invalid logo URL'
        },
        trim: true,
    }
}, { timestamps: true }); // Automatically manage createdAt and updatedAt timestamps

// Optional: Index for optimizing queries on name and domain fields
tenantSchema.index({ name: 1, domain: 1 });

const Tenant = mongoose.model("Tenant", tenantSchema);

export default Tenant;
