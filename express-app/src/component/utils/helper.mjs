import bcrypt from 'bcryptjs';


// Asynchronous function to hash a password
async function hashPassword(password) {
    const saltRounds = 10; // The cost factor controls how much time is needed to calculate a single bcrypt hash. Higher values are more secure but slower.
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        console.error('Hashing error:', error);
        throw error; // Rethrow or handle error appropriately
    }
}


export const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

