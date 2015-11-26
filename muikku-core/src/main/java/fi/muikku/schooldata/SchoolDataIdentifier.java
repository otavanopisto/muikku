package fi.muikku.schooldata;

import org.apache.commons.lang3.StringUtils;

public class SchoolDataIdentifier {
  
  public SchoolDataIdentifier(String identifier, String dataSource) {
    super();
    this.identifier = identifier;
    this.dataSource = dataSource;
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
    String[] idParts = StringUtils.split(id, '-');
    if (idParts.length != 2) {
      return null;
    };
    
    return new SchoolDataIdentifier(idParts[1], idParts[0]);
  }

  private String identifier;
  private String dataSource;
}
