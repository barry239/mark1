import bcrypt from 'bcryptjs';
import { createHash } from 'crypto';

import { usersCollection } from '../db/collections';

/**
 * User model
 */
class User {
    static methods = {};

    /**
     * @param {Object} data User data
     * @param {String} [data.id]
     * @param {String} [data.email]
     * @param {String} [data.username]
     * @param {Boolean} [data.activated]
     * @param {String} [data.role]
     * @param {String} [data.hashedPassword]
     */
    constructor(data) {
        this.id = data.id;
        this.email = data.email;
        this.username = data.username;
        this.activated = data.activated;
        this.role = data.role;
        this.hashedPassword = data.hashedPassword;
    }
}

/**
 * @param {String} password Password in plain text
 * @returns Promise with hashed password
 */
User.methods.hashPassword = async (password) => {
    const sha512hashedPassword = createHash('sha256').update(password).digest('hex');
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(sha512hashedPassword, salt);
}

/**
 * @param {String} password Password in plain text
 * @param {String} hashedPassword Hashed password
 * @returns Promise with boolean value, true if password matches or false if does not matches
 */
User.methods.comparePassword = async (password, hashedPassword) => {
    const sha512hashedPassword = createHash('sha512').update(password).digest('base64');
    return await bcrypt.compare(sha512hashedPassword, hashedPassword);
}

/**
 * @param {User} user User to add
 * @returns Created user id
 */
User.methods.createUser = async (user) => {
    const newUser = await usersCollection.add({
        email: user.email,
        username: user.username,
        activated: false,
        role: user.role,
        hashedPassword: user.hashedPassword
    });

    return newUser.id;
}

/**
 * @param {Object[]} [filters] Filters to apply in query
 * @param {String} filters.field
 * @param {String} filters.operator
 * @param {*} filters.value
 * @returns Array of users
 */
User.methods.getAllUsers = async (filters = []) => {
    let usersRef = usersCollection;
    filters.forEach(filter => {
        const { field, operator, value } = filter;
        usersRef = usersRef.where(field, operator, value);
    });

    const snapshot = await usersRef.get();

    if (snapshot.empty) return [];

    const users = snapshot.docs.map(doc => new User({
        id: doc.id,
        ...doc.data()
    }));

    return users;
};

/**
 * @param {String} id User id
 * @returns {Promise<User|null>} Found user or ```null``` if user not found
 */
User.methods.getUserById = async (id) => {
    const snapshot = await usersCollection.doc(id).get();

    const user = !snapshot.exists ? null : new User({
        id: snapshot.id,
        ...snapshot.data()
    });

    return user;
};

/**
 * @param {String} email User email
 * @returns {Promise<User>|null} Found user or ```null``` if user not found
 */
User.methods.getUserByEmail = async (email) => {
    const snapshot = await usersCollection.where('email', '==', email).get();

    if (snapshot.empty) return null;

    const users = snapshot.docs.map(doc => new User({
        id: doc.id,
        ...doc.data()
    }));

    return users[0];
}

/**
 * @param {String} id User id
 * @param {User} user User data to update
 */
User.methods.updateUserById = async (id, user) => {
    const { email, username, activated, role, hashedPassword } = user;

    const data = Object.assign({},
        email === undefined ? null : { email },
        username === undefined ? null : { username },
        activated === undefined ? null : { activated },
        role === undefined ? null : { role },
        hashedPassword === undefined ? null : { hashedPassword }
    );

    await usersCollection.doc(id).update(data);
};

/**
 * @param {String} id User id
 */
User.methods.deleteUserById = async (id) => {
    await usersCollection.doc(id).delete();
};

export default User;