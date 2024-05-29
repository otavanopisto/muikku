package fi.otavanopisto.muikku.plugins.chat.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Entity
public class ChatUser {

  public Long getId() {
    return id;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public String getNick() {
    return nick;
  }

  public void setNick(String nick) {
    this.nick = nick;
  }

  public ChatUserVisibility getVisibility() {
    return visibility;
  }

  public void setVisibility(ChatUserVisibility visibility) {
    this.visibility = visibility;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull
  @Column(nullable = false, unique = true)
  private Long userEntityId;

  @NotNull
  @NotEmpty
  @Column(nullable = false, unique = true)
  private String nick;
  
  @NotNull
  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private ChatUserVisibility visibility;

}
