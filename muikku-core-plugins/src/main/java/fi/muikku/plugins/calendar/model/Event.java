package fi.muikku.plugins.calendar.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@Inheritance (strategy = InheritanceType.JOINED)
public class Event {

	public Long getId() {
    return id;
  }

  public Calendar getCalendar() {
    return calendar;
  }
  
  public void setCalendar(Calendar calendar) {
    this.calendar = calendar;
  }
  
  public String getSummary() {
  	return summary;
  }
  
  public void setSummary(String summary) {
		this.summary = summary;
	}

	public String getDescription() {
    return description;
  }

	public void setDescription(String description) {
    this.description = description;
  }

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }

	public Date getStartTime() {
    return startTime;
  }

	public void setStartTime(Date startTime) {
    this.startTime = startTime;
  }

	public Date getEndTime() {
    return endTime;
  }

	public void setEndTime(Date endTime) {
    this.endTime = endTime;
  }

	public Boolean getAllDayEvent() {
    return allDayEvent;
  }

	public void setAllDayEvent(Boolean allDayEvent) {
    this.allDayEvent = allDayEvent;
  }
	
	public String getUrl() {
		return url;
	}
	
	public void setUrl(String url) {
		this.url = url;
	}

	public BigDecimal getLatitude() {
		return latitude;
	}
	
	public void setLatitude(BigDecimal latitude) {
		this.latitude = latitude;
	}

	public BigDecimal getLongitude() {
		return longitude;
	}
	
	public void setLongitude(BigDecimal longitude) {
		this.longitude = longitude;
	}

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column (nullable = false)
  @Lob
  @NotNull
  @NotEmpty
  private String summary;

  @Lob
  @Column
  private String description;

  @Column
  private String url;

  @ManyToOne
  private Calendar calendar;

  private String location;

  @Column(nullable = false)
  @NotNull
  @Temporal (TemporalType.TIMESTAMP)
  private Date startTime;

  @Column(nullable = false)
  @NotNull
  @Temporal (TemporalType.TIMESTAMP)
  private Date endTime;

  @Column(nullable = false)
  @NotNull
  private Boolean allDayEvent;

  private BigDecimal longitude;

	private BigDecimal latitude;

  // TODO: Repeat
}