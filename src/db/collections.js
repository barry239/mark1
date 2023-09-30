import admin from 'firebase-admin';

const firestore = admin.firestore();
console.log('Enter firestore');

export const usersCollection = firestore.collection('users');
