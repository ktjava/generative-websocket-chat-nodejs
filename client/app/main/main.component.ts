const angular = require('angular');
const ngRoute = require('angular-route');
import routing from './main.routes';

export class MainController {
  $http;
  socket;
  awesomeThings = [];
  newThing = '';

  /*@ngInject*/
  constructor($http, $scope, socket) {
    this.$http = $http;
    this.socket = socket;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
      
    var doc = angular.element(document),
        messages = angular.element(document.getElementById('messages')),
        messageForm = angular.element(document.getElementById('message_form')),
        fileForm = angular.element(document.getElementById('file_form')),
        chatShellOpen = angular.element(document.getElementById("chat_shell_open")),
        timeOpen = angular.element(document.getElementById("time_open")),
        chatShell = angular.element(document.getElementById("chat_shell")),
        chatShellOpen = angular.element(document.getElementById("chat_shell_open")),
        time = angular.element(document.getElementById("time")),
        timeOpen = angular.element(document.getElementById("time_open")),
        fileReader = new FileReader;
      
    chatShellOpen.on("click", function(){
        if(chatShell.css("opacity") == "0"){
            chatShell.css("opacity","0.7");
            chatShell.css("pointer-events","auto");
            chatShellOpen.css("background","rgba(0,0,0,0.5)");
        }else{
            chatShell.css("opacity","0");
            chatShell.css("pointer-events","none");
            chatShellOpen.css("background","rgba(0,0,0,0)");
        }
    });
    timeOpen.on("click", function(){
        if(time.css("opacity") == "0"){
            time.css("opacity","1");
            time.css("pointer-events","auto");
            timeOpen.css("background","rgba(0,0,0,0.5)");
        }else{
            time.css("opacity","0");
            time.css("pointer-events","none");
            timeOpen.css("background","rgba(0,0,0,0)");
        }
    });
    fileForm.on('change', function(event){
      var files = event.target.files;
      fileReader.readAsDataURL(files[0]);
    });
    doc.on('mousemove', function(event){
        window.mousex = event.clientX, window.mousey = event.clientY;
        socket.socket.emit('mouse_send', { time: $scope.name, mousex: window.mousex, mousey: window.mousey });
    });
    socket.socket.on('mouse_reply', function(data) {
        window.mousex = data.mousex, window.mousey = data.mousey;
    });
    $scope.name = $scope.message = '';
    $scope.submit = function() {
      var feed = "";
      if($scope.name != ""){
        socket.socket.emit('message_send', { name: $scope.name, message: $scope.message, image: fileReader.result });
        feed = '<p>'+$scope.name+' :';
        if($scope.message != "") feed += $scope.message;
        feed += '</p>';
      　if(fileReader.result != null) feed += '<a href="'+fileReader.result+'" target="blank_"><img width="240px" src="'+fileReader.result+'"></a>';
        messages.prepend(feed);
        messageForm.val('');
        fileForm.val('');
        fileReader = null;
        fileReader = new FileReader;
      }
    };
    socket.socket.on('message_reply', function(data) {
      var feed = "";
      if(data.name != ""){
        feed = '<p>'+data.name+' :';
        if(data.message != "") feed += data.message;
        feed += '</p>';
      　if(data.image != null) feed += '<a href="'+data.image+'" target="blank_"><img width="240px" src="'+data.image+'"></a>';
        messages.prepend(feed);
      }
    });
  }

  $onInit() {
    this.$http.get('/api/things').then(response => {
      this.awesomeThings = response.data;
      this.socket.syncUpdates('thing', this.awesomeThings);
    });
  }

  addThing() {
    if (this.newThing) {
      this.$http.post('/api/things', { name: this.newThing });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete('/api/things/' + thing._id);
  }
}

export default angular.module('generativeWebsocketChatNodejsApp.main', [
  ngRoute])
    .config(routing)
    .component('main', {
      template: require('./main.html'),
      controller: MainController
    })
    .name;
