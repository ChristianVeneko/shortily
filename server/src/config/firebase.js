import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

//debugging
console.log("FIREBASE_PRIVATE_KEY from env:", process.env.FIREBASE_PRIVATE_KEY);

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
  })
});

// Exportar instancias de Firestore y Auth
export const db = admin.firestore();
export const auth = admin.auth();

db.settings({
  ignoreUndefinedProperties: true
});

// Verificar la conexión de manera más robusta
const verifyConnection = async () => {
  try {
    // Intentar una operación simple de lectura primero
    await db.collection('test').doc('test').get();
    console.log('Conexión a Firestore establecida correctamente');
  } catch (error) {
    console.error('Error al conectar con Firestore:', error);
    throw error;
  }
};

// Ejecutar la verificación de conexión
verifyConnection().catch(error => {
  console.error('Error en la verificación de conexión:', error);
}); 