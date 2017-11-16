package fi.otavanopisto.muikku.plugins.chat.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
public class UserChatSettings {
  public UserChatSettings(String userIdentifier, UserChatVisibility visibility) {
    super();
    this.userIdentifier = userIdentifier;
    this.visibility = visibility;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getUserIdentifier() {
    return userIdentifier;
  }

  public void setUserIdentifier(String userIdentifier) {
    this.userIdentifier = userIdentifier;
  }

  public UserChatVisibility getVisibility() {
    return visibility;
  }

  public void setVisibility(UserChatVisibility visibility) {
    this.visibility = visibility;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull
  @NotEmpty
  @Column(nullable = false, unique = true)
  private String userIdentifier;

  @NotNull
  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private UserChatVisibility visibility;
}