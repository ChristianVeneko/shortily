import { db, auth } from '../config/firebase.js';
import admin from 'firebase-admin';
import { nanoid } from 'nanoid';

// Funciones para manejo de usuarios
export const createUser = async (userData) => {
  if (!userData.email || !userData.password) {
    throw new Error('Email and password are required');
  }

  try {
    // Crear el usuario en Firebase Auth
    const userRecord = await auth.createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.name
    });

    // Guardar datos adicionales en Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email: userData.email,
      name: userData.name,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return userRecord.uid;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  if (!email) {
    throw new Error('Email is required');
  }

  try {
    // Obtener el usuario de Firebase Auth
    const userRecord = await auth.getUserByEmail(email);
    
    // Obtener datos adicionales de Firestore
    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    
    if (!userDoc.exists) {
      return null;
    }

    return { 
      id: userRecord.uid,
      ...userDoc.data()
    };
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return null;
    }
    console.error('Error getting user:', error);
    throw error;
  }
};

// Funciones para manejo de enlaces
export const createLink = async (originalUrl, userId) => {
  if (!userId || !originalUrl) {
    throw new Error('User ID and URL are required');
  }

  try {
    // Asegurarse de que la URL tenga el protocolo correcto
    let formattedUrl = originalUrl;
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const shortCode = nanoid(6);
    const linkRef = db.collection('links').doc(shortCode);
    
    const linkData = {
      originalUrl: formattedUrl,
      shortCode,
      userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await linkRef.set(linkData);
    return {
      id: shortCode,
      ...linkData
    };
  } catch (error) {
    console.error('Error creating link:', error);
    throw error;
  }
};

export const getLinkByShortCode = async (shortCode) => {
  if (!shortCode) {
    throw new Error('Short code is required');
  }

  try {
    const linkRef = db.collection('links').doc(shortCode);
    const linkDoc = await linkRef.get();

    if (!linkDoc.exists) {
      return null;
    }

    return {
      id: linkDoc.id,
      ...linkDoc.data(),
      ref: linkRef
    };
  } catch (error) {
    console.error('Error getting link:', error);
    throw error;
  }
};

export const getUserLinks = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const linksRef = db.collection('links');
    const snapshot = await linksRef
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error in getUserLinks:', error);
    throw error;
  }
};

export const deleteLink = async (linkId) => {
  if (!linkId) {
    throw new Error('Link ID is required');
  }

  try {
    const linkRef = db.collection('links').doc(linkId);
    await linkRef.delete();
  } catch (error) {
    console.error('Error deleting link:', error);
    throw error;
  }
};

export const updateLink = async (linkId, updateData) => {
  if (!linkId || !updateData?.originalUrl) {
    throw new Error('Link ID and URL are required');
  }

  try {
    const linkRef = db.collection('links').doc(linkId);
    const linkDoc = await linkRef.get();

    if (!linkDoc.exists) {
      throw new Error('Link not found');
    }

    // Asegurarse de que la URL tenga el protocolo correcto
    let formattedUrl = updateData.originalUrl;
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    await linkRef.update({
      originalUrl: formattedUrl,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    const updatedDoc = await linkRef.get();
    return {
      id: updatedDoc.id,
      ...updatedDoc.data()
    };
  } catch (error) {
    console.error('Error updating link:', error);
    throw error;
  }
}; 