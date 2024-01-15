package fi.otavanopisto.muikku.plugins.chat.rest;

public class ChatUserLeftRestModel {
  
  public ChatUserLeftRestModel() {
  }
  
  public ChatUserLeftRestModel(Long id, Boolean permanent) {
    this.id = id;
    this.permanent = permanent;
  }
  
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Boolean getPermanent() {
    return permanent;
  }

  public void setPermanent(Boolean permanent) {
    this.permanent = permanent;
  }

  private Long id;
  private Boolean permanent;

}
