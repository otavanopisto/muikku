package fi.otavanopisto.muikku.plugins.communicator.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class VacationNotifications {
  
  public Long getId() {
    return id;
  }
  
  public Long getSender() {
    return sender;
  }
  
  public void setSender(Long sender) {
    this.sender = sender;
  }
  
  public Long getReceiver() {
    return receiver;
  }
  
  public void setReceiver(Long receiver) {
    this.receiver = receiver;
  }

  public Date getNotificationDate() {
    return notificationDate;
  }
  
  public void setNotificationDate(Date notificationDate) {
    this.notificationDate = notificationDate;
  }
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column (nullable = false)
  private Long sender;
  
  @Column (nullable = false)
  private Long receiver;
  
  @Column (nullable = false)
  private Date notificationDate;
}