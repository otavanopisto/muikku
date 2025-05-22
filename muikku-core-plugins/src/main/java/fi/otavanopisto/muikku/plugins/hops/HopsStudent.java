package fi.otavanopisto.muikku.plugins.hops;

public class HopsStudent {
  
  public HopsStudent(Long userEntityId, String category) {
    this.userEntityId = userEntityId;
    this.category = category;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  private Long userEntityId;
  private String category;

}
