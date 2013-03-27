package fi.muikku.model.plugins;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class PluginSetting {

  /**
   * Returns internal unique id
   * 
   * @return Internal unique id
   */
  public Long getId() {
    return id;
  }

  public PluginSettingKey getKey() {
		return key;
	}
  
  public void setKey(PluginSettingKey key) {
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
  private PluginSettingKey key;
  
  @Column
  private String value;
}
