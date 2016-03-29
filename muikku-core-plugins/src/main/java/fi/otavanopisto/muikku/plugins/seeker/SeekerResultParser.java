package fi.otavanopisto.muikku.plugins.seeker;

import java.util.Map;

public interface SeekerResultParser {

  public String getIndexType();
  public SeekerResult parse(Map<String, Object> entry);
  
}
