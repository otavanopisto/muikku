package fi.otavanopisto.muikku.plugins.wall.rest.model;

import fi.otavanopisto.muikku.plugins.wall.model.WallType;

public class Wall {

  public Wall() {
  }

  public Wall(Long id, WallType type, String typeId) {
    super();
    this.id = id;
    this.type = type;
    this.typeId = typeId;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public WallType getType() {
    return type;
  }

  public void setType(WallType type) {
    this.type = type;
  }
  
  public String getTypeId() {
    return typeId;
  }
  
  public void setTypeId(String typeId) {
    this.typeId = typeId;
  }

  private Long id;
  private WallType type;
  private String typeId;
}
