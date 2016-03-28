  package fi.otavanopisto.muikku.model.oauth;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.validator.constraints.NotEmpty;

import fi.otavanopisto.muikku.model.users.UserEntity;

@Entity
@Cacheable (true)
@Cache (usage = CacheConcurrencyStrategy.TRANSACTIONAL)
@Inheritance (strategy = InheritanceType.JOINED)
public class Token {
  
  public Long getId() {
    return id;
  }
  
  public TokenType getType() {
    return type;
  }
  
  public void setType(TokenType type) {
    this.type = type;
  }
  
  public Consumer getConsumer() {
    return consumer;
  }
  
  public void setConsumer(Consumer consumer) {
    this.consumer = consumer;
  }
  
  public String getSecret() {
    return secret;
  }
  
  public void setSecret(String secret) {
    this.secret = secret;
  }
  
  public String getToken() {
    return token;
  }
  
  public void setToken(String token) {
    this.token = token;
  }
  
  public Long getTimestamp() {
    return timestamp;
  }
  
  public void setTimestamp(Long timestamp) {
    this.timestamp = timestamp;
  }
  
  public Long getTimeToLive() {
    return timeToLive;
  }
  
  public void setTimeToLive(Long timeToLive) {
    this.timeToLive = timeToLive;
  }

  public UserEntity getUser() {
    return user;
  }
  
  public void setUser(UserEntity user) {
    this.user = user;
  }
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column (nullable = false)
  @NotNull
  private TokenType type;
  
  @Column (nullable = false)
  @NotEmpty
  @NotNull
  private String token;
  
  @Column (nullable = false)
  @NotEmpty
  @NotNull
  private String secret;
  
  @ManyToOne
  private Consumer consumer;
  
  @Column (nullable = false)
  @NotNull
  private Long timeToLive;

  @Column (nullable = false)
  @NotNull
  private Long timestamp;
  
  @ManyToOne
  private UserEntity user;
}