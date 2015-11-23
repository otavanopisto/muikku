package fi.muikku.schooldata.entity;

public abstract class AbstractUser implements User {

  @Override
  public String getSearchId() {
    return getIdentifier() + "/" + getSchoolDataSource();
  }
  
}
