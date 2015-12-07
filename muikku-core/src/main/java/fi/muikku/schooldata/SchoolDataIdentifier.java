package fi.muikku.schooldata;

import org.apache.commons.lang3.StringUtils;

public class SchoolDataIdentifier {
  
  public SchoolDataIdentifier(String identifier, String dataSource) {
    super();
    this.identifier = identifier;
    this.dataSource = dataSource;
  }
  
  @Override
  public boolean equals(Object o) {
    return o instanceof SchoolDataIdentifier &&
        StringUtils.equals(identifier, ((SchoolDataIdentifier) o).identifier) &&
        StringUtils.equals(dataSource, ((SchoolDataIdentifier) o).dataSource);
  }

  public String getDataSource() {
    return dataSource;
  }

  public String getIdentifier() {
    return identifier;
  }
  
  public String toId() {
    return String.format("%s-%s", getDataSource(), getIdentifier());
  }
  
  @Override
  public String toString() {
    return String.format("%s/%s", getDataSource(), getIdentifier());
  }
  
  public static SchoolDataIdentifier fromId(String id) {
    int index = id == null ? -1 : id.indexOf('-');
    if (index == -1) {
      return null;
    }
    String dataSource = id.substring(0, index);
    String identifier = id.substring(index + 1);
    if (StringUtils.isBlank(dataSource) || StringUtils.isBlank(identifier)) {
      return null;
    }
    return new SchoolDataIdentifier(identifier, dataSource);
  }

  private String identifier;
  private String dataSource;
}
