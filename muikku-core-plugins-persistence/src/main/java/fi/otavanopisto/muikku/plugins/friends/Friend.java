package fi.otavanopisto.muikku.plugins.friends;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

@Entity
public class Friend {

  public Long getId() {
    return id;
  }

  public Date getCreated() {
    return created;
  }

  public void setCreated(Date created) {
    this.created = created;
  }

  public Long getUserA() {
    return userA;
  }

  public void setUserA(Long userA) {
    this.userA = userA;
  }

  public Long getUserB() {
    return userB;
  }

  public void setUserB(Long userB) {
    this.userB = userB;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column (name = "usera_id")
  private Long userA;
  
  @Column (name = "userb_id")
  private Long userB;
  
  @NotNull
  @Column (updatable=false, nullable=false)
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date created;
  
}
