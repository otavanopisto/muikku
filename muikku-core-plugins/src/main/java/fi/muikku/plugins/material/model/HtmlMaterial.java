package fi.muikku.plugins.material.model;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
public class HtmlMaterial extends Material {

  public String getCharacterData() {
    return characterData;
  }

  public void setCharacterData(String characterData) {
    this.characterData = characterData;
  }

  @Column
  private String characterData;
  
}
