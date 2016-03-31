package fi.otavanopisto.muikku.model.oauth;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.validator.constraints.NotEmpty;

@Entity
@Cacheable (true)
@Cache (usage = CacheConcurrencyStrategy.TRANSACTIONAL)
public class ConsumerPermission {
  
  public Long getId() {
    return id;
  }

  public Consumer getConsumer() {
    return consumer;
  }
  
  public void setConsumer(Consumer consumer) {
    this.consumer = consumer;
  }
  
  public String getPermission() {
    return permission;
  }
  
  public void setPermission(String permission) {
    this.permission = permission;
  }
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private Consumer consumer;
  
  @Column (nullable = false)
  @NotNull
  @NotEmpty
  private String permission;
}