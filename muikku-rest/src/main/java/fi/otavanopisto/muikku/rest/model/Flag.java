package fi.otavanopisto.muikku.rest.model;

public class Flag {

  public Flag() {
  }

  public Flag(Long id, String name, String color, String description, String ownerIdentifier) {
    super();
    this.id = id;
    this.name = name;
    this.color = color;
    this.description = description;
    this.ownerIdentifier = ownerIdentifier;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getColor() {
    return color;
  }

  public void setColor(String color) {
    this.color = color;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getOwnerIdentifier() {
    return ownerIdentifier;
  }
  
  public void setOwnerIdentifier(String ownerIdentifier) {
    this.ownerIdentifier = ownerIdentifier;
  }

  private Long id;
  private String name;
  private String color;
  private String description;
  private String ownerIdentifier;
}
