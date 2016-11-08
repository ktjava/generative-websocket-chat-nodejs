'use strict';
const angular = require('angular');
// import ngAnimate from 'angular-animate';
const ngCookies = require('angular-cookies');
const ngResource = require('angular-resource');
const ngSanitize = require('angular-sanitize');
import 'angular-socket-io';
const ngRoute = require('angular-route');


// const ngMessages = require('angular-messages');



import {routeConfig} from './app.config';


import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';


import './app.scss';

angular.module('generativeWebsocketChatNodejsApp', [
  ngCookies,
  ngResource,
  ngSanitize,

  'btford.socket-io',

  ngRoute,
  navbar,
  footer,
  main,
  constants,
  socket,
  util
])
  .config(routeConfig)
;

angular
  .element(document)
  .ready(() => {
    angular.bootstrap(document, ['generativeWebsocketChatNodejsApp'], {
      strictDi: true
    });
  });
