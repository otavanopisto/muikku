package fi.otavanopisto.muikku.model.plugins;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import fi.otavanopisto.muikku.model.users.UserEntity;

@Entity
public class PluginUserSetting {

  /**
   * Returns internal unique id
   * 
   * @return Internal unique id
   */
  public Long getId() {
    return id;
  }
  
  public UserEntity getUser() {
		return user;
	}
  
  public void setUser(UserEntity user) {
		this.user = user;
	}

  public PluginUserSettingKey getKey() {
		return key;
	}
  
  public void setKey(PluginUserSettingKey key) {
		this.key = key;
	}
  
  public String getValue() {
		return value;
	}
  
  public void setValue(String value) {
		this.value = value;
	}
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  private UserEntity user;

  @ManyToOne
  private PluginUserSettingKey key;
  
  @Column
  private String value;
}
