package fi.otavanopisto.muikku.scheduler;

import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.enterprise.event.Event;
import javax.inject.Inject;

@Singleton
public class Scheduler {
	
	@Inject
	@Scheduled (schedule = fi.otavanopisto.muikku.scheduler.Schedule.MONTHLY)
	private Event<ScheduledEvent> monthlyEvent;
	
	@Inject
	@Scheduled (schedule = fi.otavanopisto.muikku.scheduler.Schedule.WEEKLY)
	private Event<ScheduledEvent> weeklyEvent;
	
	@Inject
	@Scheduled (schedule = fi.otavanopisto.muikku.scheduler.Schedule.DAILY)
	private Event<ScheduledEvent> dailyEvent;
	
	@Inject
	@Scheduled (schedule = fi.otavanopisto.muikku.scheduler.Schedule.HOURLY)
	private Event<ScheduledEvent> hourlyEvent;
	
	@Inject
	@Scheduled (schedule = fi.otavanopisto.muikku.scheduler.Schedule.EVERY_HALF_HOUR)
	private Event<ScheduledEvent> everyHalfHourEvent;
	
	@Inject
	@Scheduled (schedule = fi.otavanopisto.muikku.scheduler.Schedule.EVERY_FIFTEEN_MINUTES)
	private Event<ScheduledEvent> everyFifteenMinutesEvent;
	
	@Inject
	@Scheduled (schedule = fi.otavanopisto.muikku.scheduler.Schedule.EVERY_FIVE_MINUTES)
	private Event<ScheduledEvent> everyFiveMinutesEvent;
	
	@Inject
	@Scheduled (schedule = fi.otavanopisto.muikku.scheduler.Schedule.EVERY_MINUTE)
	private Event<ScheduledEvent> everyMinuteEvent;
	
	@Schedule(minute = "0", hour = "0", dayOfMonth="1", persistent = false)
	public void fireMonthly() {
		ScheduledEvent event = new ScheduledEvent();
		monthlyEvent.fire(event);
	}
	
	@Schedule(minute = "0", hour = "0", dayOfWeek="0", persistent = false)
	public void fireWeekly() {
		ScheduledEvent event = new ScheduledEvent();
		weeklyEvent.fire(event);
	}
	
	@Schedule(minute = "0", hour = "0", persistent = false)
	public void fireDaily() {
		ScheduledEvent event = new ScheduledEvent();
		dailyEvent.fire(event);
	}
	
	@Schedule(minute = "0", hour = "*", persistent = false)
	public void fireHourly() {
		ScheduledEvent event = new ScheduledEvent();
		hourlyEvent.fire(event);
	}

	@Schedule(minute = "*/30", hour = "*", persistent = false)
	public void fireEveryHalfHour() {
		ScheduledEvent event = new ScheduledEvent();
		everyHalfHourEvent.fire(event);
	}
	
	@Schedule(minute = "*/15", hour = "*", persistent = false)
	public void fireEveryFifteenMinutes() {
		ScheduledEvent event = new ScheduledEvent();
		everyFifteenMinutesEvent.fire(event);
	}
	
	@Schedule(minute = "*/5", hour = "*", persistent = false)
	public void fireEveryFiveMinutes() {
		ScheduledEvent event = new ScheduledEvent();
		everyFiveMinutesEvent.fire(event);
	}

	@Schedule(minute = "*/1", hour = "*", persistent = false)
	public void fireEveryMinuteEvent() {
		ScheduledEvent event = new ScheduledEvent();
		everyMinuteEvent.fire(event);
	}
	
}
