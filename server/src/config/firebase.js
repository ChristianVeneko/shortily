import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Read and clean the private key environment variable
let firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY;

// Firebase Admin expects the private key with actual newline characters
// If the environment variable came with escaped newlines (\n), replace them.
if (firebasePrivateKey && typeof firebasePrivateKey === 'string') {
  // Remove surrounding quotes if they exist
  if (firebasePrivateKey.startsWith('"') && firebasePrivateKey.endsWith('"')) {
    firebasePrivateKey = firebasePrivateKey.substring(1, firebasePrivateKey.length - 1);
  }
  // Replace escaped newlines with actual newlines
  firebasePrivateKey = firebasePrivateKey.replace(/\\n/g, '\n');
}

if (!firebasePrivateKey) {
    console.error("Firebase private key environment variable is not set or is empty.");
    process.exit(1);
}

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: firebasePrivateKey // Use the cleaned key
  })
});

// Exportar instancias de Firestore y Auth
export const db = admin.firestore();
export const auth = admin.auth();

db.settings({
  ignoreUndefinedProperties: true
});

// Verificar la conexión (opcional, puedes quitarla si ya confías)
const verifyConnection = async () => {
  try {
    // Intenta una operación simple de lectura
    // NOTA: Esto requiere que tengas una colección 'test' y un documento 'test' (o ajusta la ruta)
    const testDoc = await db.collection('test').doc('test').get();
    console.log('Firestore connection established successfully');
    if (!testDoc.exists) {
      console.warn('Test document \'test/test\' does not exist. Connection is ok, but test read failed.');
    }

  } catch (error) {
    console.error('Error al conectar con Firestore o leer documento de prueba:', error);
    // No lanzar error aquí si solo es un documento de prueba faltante, solo si la conexión falla.
    if (error.code !== 'not-found') {
       //throw error; // Lanzar solo si el error no es simplemente que el documento no existe
    }
  }
};

verifyConnection().catch(error => {
  console.error('Error durante la verificación de conexión:', error);
}); 