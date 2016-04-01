package fi.otavanopisto.muikku.plugins.calendar.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
public class UserCalendar {
  
	public Long getId() {
		return id;
	}
	
	public Long getUserId() {
		return userId;
	}
	
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	
	public Boolean getVisible() {
		return visible;
	}
	
	public void setVisible(Boolean visible) {
		this.visible = visible;
	}
	
	public String getCalendarId() {
    return calendarId;
  }
	
	public void setCalendarId(String calendarId) {
    this.calendarId = calendarId;
  }
	
	public String getCalendarProvider() {
    return calendarProvider;
  }
	
	public void setCalendarProvider(String calendarProvider) {
    this.calendarProvider = calendarProvider;
  }
	
  @Id
	@GeneratedValue (strategy = GenerationType.IDENTITY)
	private Long id;

  // ManyToOne UserEntity
  @Column (name = "user_id")
	private Long userId;
	
  @Column (nullable = false)
  private Boolean visible;
  
  @Column (nullable = false)
  @NotNull
  @NotEmpty
  private String calendarId;
  
  @Column (nullable = false)
  @NotNull
  @NotEmpty
  private String calendarProvider;
}