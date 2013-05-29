package fi.muikku.plugins.calendar.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

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
	
	public Calendar getCalendar() {
		return calendar;
	}
	
	public void setCalendar(Calendar calendar) {
		this.calendar = calendar;
	}
	
  @Id
	@GeneratedValue (strategy = GenerationType.IDENTITY)
	private Long id;

  // ManyToOne UserEntity
  @Column (name = "user_id")
	private Long userId;
	
  @Column (nullable = false)
  private Boolean visible;
  
  @ManyToOne
  private Calendar calendar;
}