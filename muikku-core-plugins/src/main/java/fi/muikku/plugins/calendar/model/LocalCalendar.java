package fi.muikku.plugins.calendar.model;

import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class LocalCalendar extends Calendar {

	@Transient
  public CalendarType getCalendarType() {
  	return CalendarType.LOCAL;
  }

}