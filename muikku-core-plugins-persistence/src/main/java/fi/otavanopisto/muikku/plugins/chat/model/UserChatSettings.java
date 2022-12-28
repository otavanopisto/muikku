package fi.otavanopisto.muikku.plugins.chat.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import javax.validation.constraints.NotEmpty;

@Entity
public class UserChatSettings {

  public UserChatSettings() {
    
  }
  
  public UserChatSettings(Long userEntityId, UserChatVisibility visibility, String nick) {
    super();
    this.userEntityId = userEntityId;
    this.visibility = visibility;
    this.nick = nick;
  }

  public Long getId() {
    return id;
  }

  public UserChatVisibility getVisibility() {
    return visibility;
  }

  public void setVisibility(UserChatVisibility visibility) {
    this.visibility = visibility;
  }
  
  public String getNick() {
    return nick;
  }
  
  public void setNick(String nick) {
    this.nick = nick;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull
  @Column(nullable = false, unique = true)
  private Long userEntityId;

  @NotNull
  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private UserChatVisibility visibility;
  
  @NotNull
  @NotEmpty
  @Column(nullable = false, unique = true)
  private String nick;

}