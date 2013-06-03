package fi.muikku.plugins.seeker;

import fi.tranquil.TranquilEntity;

@TranquilEntity
public interface SeekerResult {

  String getLink();
  
  String getLabel();
  
  String getCategory();
  
  String getImage();
}
