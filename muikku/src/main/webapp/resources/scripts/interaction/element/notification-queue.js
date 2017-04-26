$(document).ready(function() {
  $('.notification-queue').notificationQueue();
});

window.interaction.notificationQueue = {};
window.interaction.notificationQueue.notificate = function(type, message){
  $('.notification-queue').notificationQueue('notification', type, message);
};

window.interaction.register(function(root){
	$.widget("custom.notificationQueue", {
		options : {
			'severity-info' : {
				'class' : 'notification-queue-item-info',
				'timeout' : 5000
			},
			'severity-warn' : {
				'class' : 'notification-queue-item-warn'
			},
			'severity-error' : {
				'class' : 'notification-queue-item-error'
			},
			'severity-fatal' : {
				'class' : 'notification-queue-item-fatal'
			},
			'severity-success' : {
				'class' : 'notification-queue-item-success',
				'timeout' : 5000
			},
			'severity-loading' : {
				'class' : 'notification-queue-item-loading'
			}
		},

		_create : function() {
			var context = this;
			context.element.children('.notification-queue-item').each(function(index, item) {
				context._setupItem(item);
			});
		},

		notification : function(severity, message) {
			var severityOption = this.options['severity-' + severity];
			if (severityOption) {
				return this._setupItem(
						$('<div>').data('severity', severity)
						.addClass('notification-queue-item')
						.addClass(severityOption['class'])
						.append($('<span>').html(message))
						.append($('<a>').addClass('notification-queue-item-close')
								.attr('href', 'javascript:void(null)'))
						.appendTo(this.element.find('.notification-queue-items')));
			} else {
				throw new Error("Severity " + severity + " is undefined");
			}
		},

		remove : function(item) {
			this._hide($(item));
		},

		_hide : function(item) {
		  console.log('from interaction');
			$(item).cssAnimate({
				'addClass': 'notification-queue-item-_hiding_',
				'callback': this._destroy.bind(this, item)
			});
		},

		_setupItem : function(item) {
			var severityOption = this.options['severity-' + $(item).data('severity')];
			if (severityOption && severityOption.timeout) {
				setTimeout(this._hide.bind(this, item), severityOption.timeout);
			}

			var context = this;
			var $item = $(item);
			$item.find('a.notification-queue-item-close').click(function(e){
				context._hide($item);
			});

			return $item;
		},

		_destroy : function(item) {
			item.remove();
		}
	});
});