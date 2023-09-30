import admin from 'firebase-admin';
import chalk from 'chalk';

import serviceAccount from '../../credentials.json';

// Get DB connection
try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    console.log(`Database: ${chalk.magenta('Connected')}`);
} catch (err) {
    console.log(`Database: ${chalk.red('Error')}`);
}
