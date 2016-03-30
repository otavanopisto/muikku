package fi.otavanopisto.muikku.model.notifier;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class NotifierUserAction {

  public Long getId() {
    return id;
  }

  public NotifierActionEntity getAction() {
    return action;
  }

  public void setAction(NotifierActionEntity action) {
    this.action = action;
  }

  public NotifierUserActionAllowance getAllowance() {
    return allowance;
  }

  public void setAllowance(NotifierUserActionAllowance allowance) {
    this.allowance = allowance;
  }

  public Long getUser() {
    return user;
  }

  public void setUser(Long user) {
    this.user = user;
  }

  public NotifierMethodEntity getMethod() {
    return method;
  }

  public void setMethod(NotifierMethodEntity method) {
    this.method = method;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private NotifierActionEntity action;

  @ManyToOne
  private NotifierMethodEntity method;

  private Long user;
  
  @Enumerated(EnumType.STRING)
  private NotifierUserActionAllowance allowance;
}
