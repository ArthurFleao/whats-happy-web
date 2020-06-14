import * as functions from 'firebase-functions'; // importa funcoes
import * as admin from 'firebase-admin'; // importa ações de admin
import * as speech from '@google-cloud/speech';
// admin.initializeApp(functions.config().firebase);
admin.initializeApp();
const db = admin.firestore();
console.log(db);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const maintainUserData = functions.firestore.document('dadosUsuario/{userId}').onWrite((change, context) => {
  db.collection('psicologos').doc(change.after.ref.id).get().then(function (doc) {
    if (doc.exists) {
      doc.ref.update(
        {
          dadosUsuario: change.after.data()
        }).then((result) => {
          console.log(result);
        }).catch((err) => {
          console.log(err);
        });
    }
  }).catch(function (error) {
    console.log("Error getting document:", error);
  });
  db.collection('pacientes').doc(change.after.ref.id).get().then(function (doc) {
    if (doc.exists) {
      doc.ref.update(
        {
          dadosUsuario: change.after.data()
        }).then((result) => {
          console.log(result);
        }).catch((err) => {
          console.log(err);
        });
    }
  }).catch(function (error) {
    console.log("Error getting document:", error);
  });
})

export const onFileStored = functions.storage.object().onFinalize(async (object) => {
  console.info('FILE STORED', object);

  // Creates a client
  const client = new speech.SpeechClient();

  const gcsUri = 'gs://' + object.bucket + '/' + object.name;
  // const encoding = 'LINEAR16';
  // const sampleRateHertz = 16000;
  const languageCode = 'pt-BR';

  const config = {
    // encoding: encoding,
    // sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  };
  const audio = {
    uri: gcsUri,
  };

  const request: any = {
    config: config,
    audio: audio,
  };

  const path: any = object.name?.split('/');
  const pacienteId = path[0];
  const relatoId = path[1];

  // Detects speech in the audio file
  console.info('URI', gcsUri);
  console.info('PATH', gcsUri);
  client.recognize(request).then((result) => {
    console.info('Transcription: ', result);
    db.collection(`pacientes/${pacienteId}/relatos`).doc(relatoId).update({ transcription: result }).then((saved) => {
      console.log('SAVED TO DB!', saved);

    }).catch((err) => {
      console.error(err);

    });

  }).catch((err) => {
    console.error('Transcription failed: ', err);
    db.collection(`pacientes/${pacienteId}/relatos`).doc(relatoId).update({ transcriptionFailed: err }).then((saved) => {
      console.log('ERROR SAVED TO DB!', saved);

    }).catch((error) => {
      console.error(error);
    });

  });
});

export const checkDeactivation = functions.firestore.document('pacientes/{userId}').onWrite((change, context) => {
  if (change) {
    const data = change.after.data();
    const uid = (change.after.id);
    if (data) {
      if (data.disabled === true) {
        admin.auth().updateUser(uid, { disabled: true }).then(res => {
          console.log('user disabled: ', uid);

        }).catch(err => {
          console.log('error disabling user', err);
        });
      } else {
        admin.auth().updateUser(uid, { disabled: false }).then(res => {
          console.log('user enabled: ', uid);

        }).catch(err => {
          console.log('error enabling user', err);
        });
      }
    }
  }

})
export const registerPaciente = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*'); // permtie CORS
  if (req.method === 'OPTIONS') {
    res.status(200).send('só vai');
  } else {
    const uid = req.body.data.uid;
    const responsavelUid = req.body.data.responsavelUid;
    const dadosUsuario = req.body.data.dadosUsuario;
    console.log('request', req);
    console.log('request body.data', req.body.data);


    db.collection('dadosUsuario').doc(uid).set(dadosUsuario).then((result) => {
      console.log('done');
    }).catch((err) => {
      console.error(err)
    });

    db.collection('pacientes').doc(uid).set({
      responsavel: db.collection('psicologos').doc(responsavelUid),
      dadosUsuario
    }).then((result) => {
      console.log('done');
    }).catch((err) => {
      console.log(err);
    });

    db.collection('psicologos').doc(responsavelUid).update({
      pacientes: admin.firestore.FieldValue.arrayUnion(db.collection('pacientes').doc(uid))
    }).then((result) => {
      console.log('done');
    }).catch((err) => {
      console.log(err);
    });

    res.status(200).send('Created!');
  }
});


// export const register = functions.https.onRequest((request, response) => {
//   response.set('Access-Control-Allow-Origin', '*'); // permtie CORS.set()
//   if (request.method === 'OPTIONS') {
//     response.status(200).send('só vai');
//   } else {
//     admin.auth().createUser({
//       email: request.body.data.email,
//       emailVerified: false,
//       password: request.body.data.password,
//     })
//       .then(function (userRecord) {
//         // See the UserRecord reference doc for the contents of userRecord.
//         response.status(200).send('Show!');
//         console.log("Successfully created new user:", userRecord.uid);
//         // let transaction = db.runTransaction(t => {
//         //   return t.get(cityRef)
//         //     .then(doc => {
//         //       // Add one person to the city population.
//         //       // Note: this could be done without a transaction
//         //       //       by updating the population using FieldValue.increment()
//         //       let newPopulation = doc.data().population + 1;
//         //       t.update(cityRef, { population: newPopulation });
//         //     });
//         // }).then(result => {
//         //   console.log('Transaction success!');
//         // }).catch(err => {
//         //   console.log('Transaction failure:', err);
//         // });
//       })
//       .catch(function (error) {
//         response.status(406).send('Já tem um cara com esse email bro!');
//       });
//   }
// });
// export const funcao = functions.https.onRequest((req, res) => {
//   res.set('Access-Control-Allow-Origin', '*'); // permtie CORS
//   if (req.method === 'OPTIONS') {
//     res.status(200).send('só vai');
//   } else {
//     // CODIGO DA FUÇÃO
//   }
// });
