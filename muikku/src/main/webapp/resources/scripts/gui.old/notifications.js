window._notificationQueue = new fi.internetix.s2nq.NotificationQueue();
  
function getNotificationQueue() {
  return window._notificationQueue;
}

Event.observe(window, "load", function () {
  document.body.appendChild(window._notificationQueue.domNode);
});

/**

function addInfoMessage(message, timeout) {
  getNotificationQueue().addItem(new fi.internetix.s2nq.NotificationQueueItem(message, {
    className: "notificationQueueInfoItem",
      timeout: 1000 * 3
    }
  ));
}

function addSuccessMessage(message) {
  getNotificationQueue().addItem(new fi.internetix.s2nq.NotificationQueueItem(message, {
    className: "notificationQueueSuccessItem",
    timeout: 1000 * 3
  }));
}

function addWarningMessage(message) {
  getNotificationQueue().addItem(new fi.internetix.s2nq.NotificationQueueItem(message, {
    className: "notificationQueueWarningItem",
    timeout: 1000 * 6
  }));
}

function addErrorMessage(message) {
  getNotificationQueue().addItem(new fi.internetix.s2nq.NotificationQueueItem(message, {
    className: "notificationQueueErrorItem"
  }));
}

function addCriticalMessage(message) {
  getNotificationQueue().addItem(new fi.internetix.s2nq.NotificationQueueItem(message, {
    className: "notificationQueueCriticalItem"
  }));
}

**/