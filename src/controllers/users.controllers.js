import User from '../models/User';

const userControllers = {};

userControllers.getUsers = async (req, res) => {
    const users = await User.methods.getAllUsers();

    return res.status(200).json({ users });
};

userControllers.updateUser = async (req, res) => {
    const { userId } = req.params;
    const { email, username, activated, role, password } = req.body;

    const user = await User.methods.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (email) {
        const duplicatedUser = await User.methods.getUserByEmail(email);
        if (duplicatedUser && duplicatedUser.email !== email) return res.status(409).json({
            error: 'Email already exists'
        });
    }

    if (password) var hashedPassword = await User.methods.hashPassword(password);

    const newUser = new User({
        email,
        username,
        activated,
        role,
        hashedPassword
    });
    await User.methods.updateUserById(userId, newUser);

    return res.status(200).json({ message: 'User updated successfully' });
}

/**
 * @param {Request} req 
 * @param {Response} res 
 */
userControllers.deleteUser = async (req, res) => {
    const { userId } = req.params;

    const user = await User.methods.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await User.methods.deleteUserById(userId);

    return res.status(200).json({ message: 'User deleted successfully' });
};

export default userControllers;