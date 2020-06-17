import * as functions from 'firebase-functions'; // importa funcoes
import * as admin from 'firebase-admin'; // importa ações de admin
import * as speech from '@google-cloud/speech';
import * as language from '@google-cloud/language';
// admin.initializeApp(functions.config().firebase);
admin.initializeApp();
const db = admin.firestore();
console.log(db);

const DADOS_RELATORIO_COLLECTION = 'dadosRelatorio';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const onRelatoChanged = functions.firestore.document('pacientes/{userId}/relatos/{relatoId}').onWrite((change, context) => {
  const userId = context.params.userId;
  const relatoId = context.params.relatoId;
  const relatoAnterior = change.before.data();
  const relatoAtual = change.after.data();

  if (relatoAnterior?.relato !== relatoAtual?.relato) {
    sendToNaturalLanguageApi(relatoAtual?.relato).then((result: any) => {
      saveDataToRelato(userId, relatoId, { analiseRelato: result });
    }).catch((err: any) => {
      console.error('Erro natural language relato', err);
      saveDataToRelato(userId, relatoId, { erroAnaliseRelato: err });
    });
  }

  if (relatoAtual?.hasAudio && !relatoAtual?.analiseAudioTranscrito && relatoAtual?.audioTranscrito) {
    sendToNaturalLanguageApi(relatoAtual?.audioTranscrito).then((result: any) => {
      saveDataToRelato(userId, relatoId, { analiseAudioTranscrito: result });
    }).catch((err: any) => {
      console.error('Erro natural language auido', err);

      saveDataToRelato(userId, relatoId, { erroAnaliseAudioTranscrito: err });
    });
  }


  return generateReport(change, context).then((result) => {
    console.log(result);
  }).catch((err) => {
    console.error(err);
  });
});

function saveDataToRelato(idPaciente: any, idRelato: any, data: any) {
  db.collection(`pacientes/${idPaciente}/relatos`).doc(idRelato).update(data).then((result) => {
    console.log(result);
  }).catch((err) => {
    console.error(err);
  });
}

function sendToNaturalLanguageApi(texto: string) {
  const request: any = {
    document: {
      content: texto,
      type: "PLAIN_TEXT",
    },
    features: {
      extractSyntax: true,
      extractEntities: true,
      extractDocumentSentiment: true
    }
  }

  const client = new language.LanguageServiceClient();

  return client.analyzeSentiment(request);
}
export const onRelatoDeleted = functions.firestore.document('pacientes/{userId}/relatos/{relatoId}').onDelete((change, context) => {
  return db.collection(DADOS_RELATORIO_COLLECTION).doc(change.id).delete().then((result) => {
    console.log('deleted ', result);
  }).catch((err) => {
    console.error(err);
  });
});

function generateReport(change: any, context: any) {

  const userId = context.params.userId; // id do dono do relato

  const dp = db.collection('pacientes').doc(userId).get(); // prepara o get dos dados de paciente do dono do relato (para conseguir o id do responsavel)
  const du = db.collection('dadosUsuario').doc(userId).get();  // prepara o get dos dados do usuario (para pegar o nome)
  return Promise.all([dp, du]).then((result) => { // faz os dois gets acima em paralelo (para poupar tempo) e quando eles acabam segue o código

    const dataPaciente = result[0].data(); // pega os dados de paciente
    const dataUser = result[1].data(); // pega os dados de usuário
    // console.log('dataPAciente', dataPaciente);
    // console.log('dataUser', dataUser);

    if (dataPaciente && dataUser) { // se tudo tiver ok
      console.log('idResponsavel', dataPaciente.responsavel);
      const idResponsavel = dataPaciente.responsavel.id; // recupera o id do responsável

      db.collection('dadosUsuario').doc(idResponsavel).get().then((responsavel) => { // pega os dados do responsavel
        const data: any = change.after.data(); // pega todos os dados do relato que triggou a função
        if (data) { // proteção contra undefined
          data.idPaciente = userId; // além dos dados de relato salva o id do dono do relato
          data.nomePaciente = dataUser.nomeCompleto; // alem de tudo salva o nome do id do relato
          data.idResponsavel = idResponsavel; // alem de tudo salva o id do responsavel
          data.nomeResponsavel = responsavel.data()?.nomeCompleto; // alem de tudo salva o nome do responsavel
        }
        console.log('relato id', context.params.relatoId);

        db.collection(DADOS_RELATORIO_COLLECTION).doc(context.params.relatoId).set(data).then((final: any) => { // cria ou modifica o documento na collection dados relatorio. Agora está pronto para ir pro BigQuery
          console.log('relato saved to db', final);
        }).catch((error: any) => {
          console.error(error);
        });
      }).catch((err) => {
        console.error(err);
      });
    }
  }).catch((err) => {
    console.error(err);
  });
}

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
});

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
  client.recognize(request).then((res: any) => {
    console.info('Transcription: ', res);
    let audioTranscrito = '';
    let noResults = true;
    res.forEach((transcript: any) => {
      if (transcript && transcript !== null) {
        if (transcript.results?.length > 0) {
          transcript.results?.forEach((result: any) => {
            result?.alternatives?.forEach((alternative: any) => {
              if (alternative !== null) {
                audioTranscrito += '\n' + alternative.transcript;
                noResults = false;
              }
            });
          });
        }
      }
    });
    db.collection(`pacientes/${pacienteId}/relatos`).doc(relatoId).update({
      transcription: res,
      audioTranscrito,
      noResults,
    }).then((saved) => {
      console.log('SAVED TO DB!', saved);

    }).catch((err) => {
      saveDataToRelato(pacienteId, relatoId, { transcriptionError: err });

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

});

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
