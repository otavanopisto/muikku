package fi.otavanopisto.muikku.model.oauth;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.validator.constraints.NotEmpty;

@Entity
@Cacheable (true)
@Cache (usage = CacheConcurrencyStrategy.TRANSACTIONAL)
public class Consumer {
  
  public Long getId() {
    return id;
  }

  public String getConnectURI() {
    return connectURI;
  }
  
  public void setConnectURI(String connectURI) {
    this.connectURI = connectURI;
  }
  
  public String getConsumerKey() {
    return consumerKey;
  }
  
  public void setConsumerKey(String consumerKey) {
    this.consumerKey = consumerKey;
  }
  
  public String getConsumerSecret() {
    return consumerSecret;
  }
  
  public void setConsumerSecret(String consumerSecret) {
    this.consumerSecret = consumerSecret;
  }
  
  public String getDisplayName() {
    return displayName;
  }
  
  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column (nullable = false)
  @NotEmpty
  @NotNull
  private String consumerKey;

  @Column (nullable = false)
  @NotEmpty
  @NotNull
  private String consumerSecret;
  
  @Column (nullable = false)
  @NotEmpty
  @NotNull
  private String displayName;
  
  @Column (nullable = false)
  @NotEmpty
  @NotNull
  private String connectURI;
}