package fi.muikku.plugins.calendar.model;

import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class SubscribedCalendar extends Calendar {
  
	public String getUrl() {
		return url;
	}
	
	public void setUrl(String url) {
		this.url = url;
	}
	
	@Transient
  public CalendarType getCalendarType() {
  	return CalendarType.SUBSCRIBED;
  }

  private String url;
}