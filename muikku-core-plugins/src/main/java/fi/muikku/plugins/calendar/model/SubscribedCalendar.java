package fi.muikku.plugins.calendar.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

@Entity
@PrimaryKeyJoinColumn(name = "id")
public class SubscribedCalendar extends Calendar {

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Date getLastSynchronized() {
		return lastSynchronized;
	}

	public void setLastSynchronized(Date lastSynchronized) {
		this.lastSynchronized = lastSynchronized;
	}

	@Transient
	public CalendarType getCalendarType() {
		return CalendarType.SUBSCRIBED;
	}

	@Column(nullable = false)
	@NotNull
	private String url;

	@Column(nullable = false)
	@NotNull
	private Date lastSynchronized;
}