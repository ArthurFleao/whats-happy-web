import * as functions from 'firebase-functions'; // importa funcoes
import * as admin from 'firebase-admin' // importa ações de admin
admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

// expor const 'endpoint'
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

export const register = functions.https.onRequest((request, response) => {
  response.set('Access-Control-Allow-Origin', '*'); // permtie CORS
  if (request.method === 'OPTIONS') {
    response.status(200).send('só vai');
  } else {

    admin.auth().createUser({
      email: "user@example.com",
      emailVerified: false,
      password: "secretPassword",
      displayName: "John Doe",
      photoURL: "http://www.example.com/12345678/photo.png",
      disabled: false
    })
      .then(function (userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        response.status(200).send('Show!');
        console.log("Successfully created new user:", userRecord.uid);
      })
      .catch(function (error) {
        response.status(406).send('Já tem um cara com esse email bro!');
        console.log("Error creating new user:", error);
      });
  }
});
