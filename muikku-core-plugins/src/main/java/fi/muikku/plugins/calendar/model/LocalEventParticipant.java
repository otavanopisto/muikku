package fi.muikku.plugins.calendar.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class LocalEventParticipant {
  
  public Long getId() {
    return id;
  }
  
  public Long getUserId() {
		return userId;
	}
  
  public void setUserId(Long userId) {
		this.userId = userId;
	}
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  // @ManyToOne
  @Column (name = "user_id")
  private Long userId;
}