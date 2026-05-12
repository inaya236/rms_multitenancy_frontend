importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

console.log("sw file loaded")

firebase.initializeApp({
  apiKey: "AIzaSyDW9Lo5OlMwTJb3_5rWq_bvKVb2DAVHS8c",
  authDomain: "rms-alerts-b10ab.firebaseapp.com",
  projectId: "rms-alerts-b10ab",
  messagingSenderId: "151019487398",
  appId: "1:151019487398:web:36012f1f83460c69b73467",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  });
});

self.addEventListener('install',(event)=>{
  self.skipWaiting();
})

self.addEventListener('activate',(event)=>{
event.waitUntil(self.clients.claim());
})