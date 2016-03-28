package fi.otavanopisto.muikku.security;

import fi.otavanopisto.security.ContextReference;


public interface ContextResolver {

  boolean handlesContextReference(ContextReference contextReference);
  
}
