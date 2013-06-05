package fi.muikku.plugins.seeker;

import fi.tranquil.TranquilEntity;

@TranquilEntity
public interface SeekerResult {

  String getTemplate();
  
  String getCategory();
}
