import * as functions from 'firebase-functions'; // importa funcoes
import * as admin from 'firebase-admin'; // importa ações de admin
import * as speech from '@google-cloud/speech';
import * as language from '@google-cloud/language';
// admin.initializeApp(functions.config().firebase);
admin.initializeApp();
const db = admin.firestore();

const DADOS_RELATORIO_COLLECTION = 'dadosRelatorio';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const onRelatoChanged = functions.firestore.document('pacientes/{userId}/relatos/{relatoId}').onWrite((change, context) => {
  const userId = context.params.userId;
  const relatoId = context.params.relatoId;
  const relatoAnterior = change.before.data();
  const relatoAtual = change.after.data();

  if (!relatoAnterior) { // se o relato é novo
    console.log('relato é novo');
    db.collection('pacientes').doc(userId).get().then((result) => {
      const responsavelUID = result.data()?.responsavel.id;
      sendNotification({
        message: 'enviou um novo relato!',
        type: 'novo-relato',
        pacienteUID: userId,
        data: new Date().toISOString(),
        relatoId,
        responsavelUID,
      }, responsavelUID);
    }).catch((err) => {
      console.error(err);
    });
  }


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



  let score;

  if (relatoAnterior?.analiseRelato !== relatoAtual?.analiseRelato) {
    score = calcularNivelAlerta(relatoAtual?.analiseRelato, relatoAtual?.relato);
  }

  if (relatoAtual?.analiseAudioTranscrito !== relatoAnterior?.analiseAudioTranscrito) {
    score = calcularNivelAlerta(relatoAtual?.analiseAudioTranscrito, relatoAtual?.audioTranscrito);
  }

  if (score) {
    if (score >= 80 && score < 150) {
      db.collection('pacientes').doc(userId).get().then((result) => {
        const responsavelUID = result.data()?.responsavel.id;
        sendNotification({
          message: 'enviou um relato que foi classificado pelo sistema como PREOCUPANTE!',
          type: 'novo-relato-preocupante',
          pacienteUID: userId,
          data: new Date().toISOString(),
          relatoId,
          responsavelUID,
        }, responsavelUID);
      }).catch((err) => {
        console.error(err);
      });
    }
    if (score > 150) {
      db.collection('pacientes').doc(userId).get().then((result) => {
        const responsavelUID = result.data()?.responsavel.id;
        sendNotification({
          message: 'enviou um relato que foi classificado pelo sistema como PERIGOSO!',
          type: 'novo-relato-perigoso',
          pacienteUID: userId,
          data: new Date().toISOString(),
          relatoId,
          responsavelUID,
        }, responsavelUID);
      }).catch((err) => {
        console.error(err);
      });
    }
  }

  console.log('score:', score);


  return generateReport(change, context).then((result) => {
    console.log('report salvo');
  }).catch((err) => {
    console.error(err);
  });
});


function prepareDataForNotification(data: any) {
  let bodyString = data.nomePaciente || 'Seu paciente';
  bodyString += ' acabou de publicar um novo relato, venha ver como ele está se sentindo!';
  const payload = {
    notification: {
      title: data.message,
      body: bodyString
    }
  };

  return payload;
}

function sendNotification(data: any, destinatario: any) {
  db.collection('dadosUsuario').doc(destinatario).get().then((result) => {
    if (result.data()?.deviceId) {
      db.collection('dadosUsuario').doc(data.pacienteUID).get().then((userData) => {
        let newData = data;
        newData.nomePaciente = userData.data()?.nomeCompleto;
        newData = prepareDataForNotification(data);
        admin.messaging().sendToDevice(result.data()?.deviceId, newData).then((not) => {
          console.log('notificacao enviada');
        }).catch((err) => {
          console.error(err);
        });
      }).catch((err) => {
        console.error(err);
      });
    }
  }).catch((err) => {
    console.error(err);
  });
  db.collection('notificacoes/' + destinatario + '/notificacoes').doc(data.relatoId).set(data).then((result) => {
    console.log('notificação salva no bd');
  }).catch((err) => {
    console.error(err);
  });
}

function saveDataToRelato(idPaciente: any, idRelato: any, data: any) {
  db.collection(`pacientes/${idPaciente}/relatos`).doc(idRelato).update(data).then((result) => {
    console.log('data saved to relato');
  }).catch((err) => {
    console.error(err);
  });
}

function sendToNaturalLanguageApi(texto: string) {
  const request: any = {
    document: {
      content: texto,
      laguage: 'pt-BR',
      type: 'PLAIN_TEXT',
    },
    features: {
      extractSyntax: true,
      // extractEntitySentiment: true, // não funciona em pt-br
      extractEntities: true,
      extractDocumentSentiment: true,
      // classifyText: true // não funciona em pt-br
    },
    encodingType: 'UTF8'
  };
  const client = new language.LanguageServiceClient();

  return client.annotateText(request);
}

function classificaSentiment(score: number, magnitude: number) {
  let str = '';
  const magnitudeAbsoluta = Math.abs(magnitude);
  if (magnitudeAbsoluta > 2) {
    str += 'Claramente ';
  } else {
    str += 'Provavelmente ';
  }

  if (score > 0.25) {
    str += 'Positivo';
  } else if (score < 0.25) {
    str += 'Negativo';
  } else {
    str += 'Neutro';
  }

  if (magnitude > 2 && Math.abs(score) < 0.25) {
    str = 'Misto';
  }
  return str;
}

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
      // console.log('idResponsavel', dataPaciente.responsavel);
      const idResponsavel = dataPaciente.responsavel.id; // recupera o id do responsável

      db.collection('dadosUsuario').doc(idResponsavel).get().then((responsavel) => { // pega os dados do responsavel
        const data: any = change.after.data(); // pega todos os dados do relato que triggou a função
        if (data) { // proteção contra undefined
          data.idPaciente = userId; // além dos dados de relato salva o id do dono do relato
          data.nomePaciente = dataUser.nomeCompleto; // alem de tudo salva o nome do id do relato
          data.idResponsavel = idResponsavel; // alem de tudo salva o id do responsavel
          data.nomeResponsavel = responsavel.data()?.nomeCompleto; // alem de tudo salva o nome do responsavel


          if (data.analiseRelato) {
            data.relatoAlertaScore = calcularNivelAlerta(data.analiseRelato, data.relato);
            data.relatoSentiment = classificaSentiment(data.analiseRelato[0].documentSentiment.score,
              data.analiseRelato[0].documentSentiment.magnitude);
          }

          if (data.analiseAudioTranscrito) {
            data.audioAlertaScore = calcularNivelAlerta(data.analiseAudioTranscrito, data.audioTranscrito);
            data.audioSentiment = classificaSentiment(data.analiseAudioTranscrito[0].documentSentiment.score,
              data.analiseAudioTranscrito[0].documentSentiment.magnitude);
          }


        }
        // console.log('relato id', context.params.relatoId);

        db.collection(DADOS_RELATORIO_COLLECTION).doc(context.params.relatoId).set(data).then((final: any) => { // cria ou modifica o documento na collection dados relatorio. Agora está pronto para ir pro BigQuery
          console.log('relato saved to db');
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

function calcularNivelAlerta(analise: any, texto?: string) {
  let score = 0;
  analise.forEach((document: any) => {
    if (document && document !== null) {
      // SENTIMENT
      const docScore = document.documentSentiment.score;
      const docMag = document.documentSentiment.magnitude;
      if (docScore < 0.25) {
        score += (Math.abs(docScore) * docMag) * 150; // quanto mais negativo for o relato, mais alerta score
      }
      // END SENTIMENT
      console.log('sentiment score', score);

      // TOKENS
      document.tokens.forEach((token: { lemma: any; }) => {
        switch (token.lemma) {
          case 'suicídio':
            score += 65;
            break;
          case 'suicidar':
            score += 70;
            break;
          case 'suicída':
            score += 70;
            break;
          case 'assassinato':
            score += 50;
            break;
          case 'assassinar':
            score += 65;
            break;
          case 'matar':
            score += 65;
            break;
          case 'cortar':
            score += 30;
            break;
          case 'machucar':
            score += 30;
            break;
          case 'agredir':
            score += 30;
            break;
          case 'prédio':
            score += 40;
            break;
          case 'ponte':
            score += 40;
            break;
          case 'carro':
            score += 30;
            break;
          case 'arma':
            score += 50;
            break;
          case 'tiro':
            score += 50;
            break;
          case 'atirar':
            score += 50;
            break;
          case 'cabeça':
            score += 30;
            break;
          case 'peito':
            score += 30;
            break;
          case 'remédio':
            score += 30;
            break;
          case 'overdose':
            score += 60;
            break;
          case 'quero':
            score += 30;
            break;
          case 'pretendo':
            score += 30;
            break;
          case 'preciso':
            score += 30;
            break;
          case 'vou':
            score += 30;
            break;
          case 'acabar':
            score += 20;
            break;
          case 'acabou':
            score += 20;
            break;
          case 'me':
            score += 15;
            break;
          case 'morto':
            score += 45;
            break;
          case 'morrendo':
            score += 45;
            break;
          case 'sangue':
            score += 50;
            break;
          case 'sangrando':
            score += 50;
            break;
          case 'ensanguentado':
            score += 50;
            break;
          case 'faca':
            score += 50;
            break;
          case 'pescoço':
            score += 50;
            break;
          case 'pulso':
            score += 50;
            break;
          case 'pulsos':
            score += 50;
            break;

          default:
            break;
        }
      });
      // END TOKENS
    }

  });

  if (texto) {
    if (texto.includes('eu pretendo me matar')) {
      score += 100;
    }
    if (texto.includes('eu quero me matar')) {
      score += 100;
    }
    if (texto.includes('eu vou me matar')) {
      score += 100;
    }
    if (texto.includes('eu pretendo me suicidar')) {
      score += 100;
    }
    if (texto.includes('eu quero me suicidar')) {
      score += 100;
    }
    if (texto.includes('eu vou me suicidar')) {
      score += 100;
    }
    if (texto.includes('vou me')) {
      score += 15;
    }
    if (texto.includes('quero me')) {
      score += 15;
    }
    if (texto.includes('me matar')) {
      score += 75;
    }
    if (texto.includes('me suicidar')) {
      score += 75;
    }
    if (texto.includes('acabar com')) {
      score += 45;
    }
    if (texto.includes('acabar com a vida')) {
      score += 85;
    }
    if (texto.includes('acabar com a minha vida')) {
      score += 85;
    }
    if (texto.includes('não aguento')) {
      score += 40;
    }
    if (texto.includes('pular d')) {
      score += 40;
    }
    if (texto.includes('jogar d')) {
      score += 40;
    }
    if (texto.includes('pular n')) {
      score += 40;
    }
    if (texto.includes('jogar n')) {
      score += 40;
    }
    if (texto.includes('atirar d')) {
      score += 40;
    }
    if (texto.includes('atirar n')) {
      score += 60;
    }
    if (texto.includes('cortar m')) {
      score += 40;
    }
  }

  return score;
}

export const onRelatoDeleted = functions.firestore.document('pacientes/{userId}/relatos/{relatoId}').onDelete((change, context) => {
  return db.collection(DADOS_RELATORIO_COLLECTION).doc(change.id).delete().then((result) => {
    console.log('deleted ', result);
  }).catch((err) => {
    console.error(err);
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
  // console.info('URI', gcsUri);
  // console.info('PATH', gcsUri);
  client.recognize(request).then((res: any) => {
    console.info('Transcription: ', res);
    let audioTranscrito = '';
    let confiabilidadeTotal = 0;
    let numAlternativas = 0;
    let noResults = true;
    res.forEach((transcript: any) => {
      if (transcript && transcript !== null) {
        if (transcript.results?.length > 0) {
          transcript.results?.forEach((result: any) => {
            result?.alternatives?.forEach((alternative: any) => {
              if (alternative !== null) {
                audioTranscrito += '.\n' + alternative.transcript;
                noResults = false;
                if (alternative.confidence) {
                  numAlternativas++;
                  confiabilidadeTotal += alternative.confidence;
                }
              }
            });
          });
        }
      }
    });

    let confiabilidade = 0;
    if (confiabilidadeTotal > 0 && numAlternativas > 0) {
      confiabilidade = confiabilidadeTotal / numAlternativas;
    }

    db.collection(`pacientes/${pacienteId}/relatos`).doc(relatoId).update({
      transcription: res,
      audioTranscrito,
      noResults,
      confiabilidade,
    }).then((saved) => {
      // console.log('SAVED TO DB!', saved);

    }).catch((err) => {
      console.error(err);
      saveDataToRelato(pacienteId, relatoId, { transcriptionError: true });

    });

  }).catch((err) => {
    console.error('Transcription failed: ', err);
    saveDataToRelato(pacienteId, relatoId, { transcriptionError: true });
  });
});

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
    console.log('Error getting document:', error);
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
    console.log('Error getting document:', error);
  });
});

export const checkPsicologoDeactivation = functions.firestore.document('psicologos/{userId}').onWrite((change, context) => {
  if (change) {

    const psicoAnterior = change.before.data();
    const psicoAtual = change.after.data();

    if (psicoAnterior?.disabled !== psicoAtual?.disabled) {
      if (psicoAtual?.disabled) {
        db.collection('psicologos').doc(change.after.id).collection('pacientes').get().then((result) => {
          result.forEach(paciente => {
            db.collection('pacientes').doc(paciente.id).update({ disabled: true }).then((dbu) => {
              console.log('paciente disabled: ') + paciente.id;
            }).catch((err) => {
              console.error(err);
            });
          });
        }).catch((err) => {
          console.error(err);
        });
      }
    }
  }
});
export const checkPacienteDeactivation = functions.firestore.document('pacientes/{userId}').onWrite((change, context) => {
  if (change) {
    const atual = change.after.data();
    const anterior = change.before.data();
    const uid = (change.after.id);

    // pega a referencia da subcoleção paciente
    const pacienteRef = db.collection('pacientes').doc(uid);


    if (atual && anterior) {
      console.log('enrou no 1 if anter', anterior.responsavel.id);
      console.log('enrou no 1 if atua', atual.responsavel.id);
      if (anterior !== null && anterior.responsavel.id !== atual.responsavel.id) {
        console.log('enrou no 2 if');

        db.collection('psicologos/' + atual.responsavel.id + '/pacientes').doc(uid).set({
          paciente: pacienteRef
        }).then(resposta => {

          db.collection('psicologos/' + anterior.responsavel.id + '/pacientes').doc(uid).delete().then(res => {
            console.log('dpsicolog anterior deletado');
          }, err => {
            console.error(err);
          });
        }, error => {
          console.error(error);
        });
      }
    }


    if (atual) {
      if (atual.disabled === true) {
        admin.auth().updateUser(uid, { disabled: true }).then(res => {
          // console.log('user disabled: ', uid);

        }).catch(err => {
          console.error('error disabling user', err);
        });
      } else {
        admin.auth().updateUser(uid, { disabled: false }).then(res => {
          // console.log('user enabled: ', uid);

        }).catch(err => {
          console.error('error enabling user', err);
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
    // console.log('request', req);
    // console.log('request body.data', req.body.data);


    db.collection('dadosUsuario').doc(uid).set(dadosUsuario).then((result) => {
      // console.log('done');
    }).catch((err) => {
      console.error(err);
    });

    db.collection('pacientes').doc(uid).set({
      responsavel: db.collection('psicologos').doc(responsavelUid),
      dadosUsuario
    }).then((result) => {
      // console.log('done');
    }).catch((err) => {
      console.error(err);
    });

    db.collection('psicologos').doc(responsavelUid).update({
      pacientes: admin.firestore.FieldValue.arrayUnion(db.collection('pacientes').doc(uid))
    }).then((result) => {
      // console.log('done');
    }).catch((err) => {
      console.error(err);
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
