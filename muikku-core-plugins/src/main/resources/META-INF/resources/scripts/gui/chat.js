
      $(document).ready(function() {
        $(document).on("Chat:message", function (event, chatMessage) {
          var msg = $('<div></div>');
          msg.append(new Date().toLocaleTimeString() + ": ");
          msg.append(chatMessage.text);
          $('.chatBox').append(msg);
        });
      });

      function _sendChatBoxMessage() {
        var data = {
          roomId: 1,
          text: $('.chatBox').find("input[name='chatBoxText']").val()
        };

        $(document).muikkuWebSocket("sendMessage", 'Chat:message', data);
      }
      
      