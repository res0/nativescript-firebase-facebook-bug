import Vue from 'nativescript-vue'
import { firebase } from '@nativescript/firebase-core'
import '@nativescript/firebase-messaging'
import { LoginManager } from '@nativescript/facebook'
import Home from './components/Home'

firebase().initializeApp()
firebase().messaging().showNotificationsWhenInForeground = true;
LoginManager.init();
  
new Vue({
  render: (h) => h('frame', [h(Home)]),
}).$start()