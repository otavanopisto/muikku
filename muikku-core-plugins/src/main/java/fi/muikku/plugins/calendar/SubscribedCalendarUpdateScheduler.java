package fi.muikku.plugins.calendar;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import net.fortuna.ical4j.data.ParserException;

import fi.muikku.plugins.calendar.model.SubscribedCalendar;
import fi.muikku.scheduler.Scheduled;
import fi.muikku.scheduler.ScheduledEvent;

@ApplicationScoped
public class SubscribedCalendarUpdateScheduler {

	@Inject
	private Logger logger;

	@Inject
	private CalendarController calendarController;

	public void updateNextSubscribedCalendar(@Observes @Scheduled (schedule = fi.muikku.scheduler.Schedule.EVERY_MINUTE) ScheduledEvent event) {
		SubscribedCalendar subscribedCalendar = calendarController.getNextSubscribedCalendarToBeSynchronized();
		if (subscribedCalendar != null) {
			logger.info("Synchronizing subscribed calendar #" + subscribedCalendar.getId());
			try {
				calendarController.synchronizeSubscribedCalendar(subscribedCalendar);
			} catch (IOException | ParserException | URISyntaxException e) {
				logger.log(Level.SEVERE, "Calendar synchronization failed", e);
			} finally {
				logger.info("Synchronizing subscribed calendar #" + subscribedCalendar.getId() + " synchronized");
			}
		}
	}

}
