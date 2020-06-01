import * as functions from 'firebase-functions'; // importa funcoes
import * as admin from 'firebase-admin'; // importa ações de admin
// admin.initializeApp(functions.config().firebase);
admin.initializeApp();
const db = admin.firestore();
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
      email: request.body.email,
      emailVerified: false,
      password: request.body.password,
    })
      .then(function (userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        response.status(200).send('Show!');
        console.log("Successfully created new user:", userRecord.uid);
        // let transaction = db.runTransaction(t => {
        //   return t.get(cityRef)
        //     .then(doc => {
        //       // Add one person to the city population.
        //       // Note: this could be done without a transaction
        //       //       by updating the population using FieldValue.increment()
        //       let newPopulation = doc.data().population + 1;
        //       t.update(cityRef, { population: newPopulation });
        //     });
        // }).then(result => {
        //   console.log('Transaction success!');
        // }).catch(err => {
        //   console.log('Transaction failure:', err);
        // });
      })
      .catch(function (error) {
        response.status(406).send('Já tem um cara com esse email bro!');
      });
  }
});

export const getUserData = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*'); // permtie CORS
  if (req.method === 'OPTIONS') {
    res.status(200).send('só vai');
  } else {

  }
});
// export const funcao = functions.https.onRequest((req, res) => {
//   res.set('Access-Control-Allow-Origin', '*'); // permtie CORS
//   if (req.method === 'OPTIONS') {
//     res.status(200).send('só vai');
//   } else {
//     // CODIGO DA FUÇÃO
//   }
// });
