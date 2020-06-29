importScripts('https://www.gstatic.com/firebasejs/7.14.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.4/firebase-messaging.js');firebase.initializeApp({
  apiKey: "AIzaSyA1bwjSkdQ1GTle-SNNKAQqoifLFIAZwn4",
  authDomain: "whats-happy.firebaseapp.com",
  databaseURL: "https://whats-happy.firebaseio.com",
  projectId: "whats-happy",
  storageBucket: "whats-happy.appspot.com",
  messagingSenderId: "1016755620811",
  appId: "1:1016755620811:web:d1ca66d80fe64ed570844e",
  measurementId: "G-SCYB6P35JD"
});const messaging = firebase.messaging();
