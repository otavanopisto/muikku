package fi.muikku.plugins.calendar.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@Inheritance (strategy = InheritanceType.JOINED)
public class Calendar {
  
  public Long getId() {
    return id;
  }
  
  public String getName() {
		return name;
	}
  
  public void setName(String name) {
		this.name = name;
	}
  
  public Long getEnvironmentId() {
		return environmentId;
	}
  
  public void setEnvironmentId(Long environmentId) {
		this.environmentId = environmentId;
	}
  
  public CalendarCategory getCalendarCategory() {
		return calendarCategory;
	}
  
  public void setCalendarCategory(CalendarCategory calendarCategory) {
		this.calendarCategory = calendarCategory;
	}
  
  @Transient
  public CalendarType getCalendarType() {
  	return null;
  }
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotNull
  @NotEmpty
  @Column (nullable = false)
  private String name;
  
  // ManyToOne Environment
  private Long environmentId;
	
  @ManyToOne
  private CalendarCategory calendarCategory;
}