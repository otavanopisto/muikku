package fi.muikku.plugins.calendar;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join(path = "/calendar/month", to = "/calendars/view_month.jsf")
@LoggedIn
public class CalendarMonthBackingBean {
	
	@RequestAction
	public String init() {
    return null;
	}
}

