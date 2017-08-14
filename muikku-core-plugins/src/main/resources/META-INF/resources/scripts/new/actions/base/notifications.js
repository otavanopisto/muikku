export default {
  displayNotification: function(message, severity){
    return {
      'type': 'ADD_NOTIFICATION',
      'payload': {
        'severity': severity,
        'message': message
      }
    }
  },
  hideNotification: function(notification){
    return {
      'type': 'HIDE_NOTIFICATION',
      'payload': notification
    }
  }
};