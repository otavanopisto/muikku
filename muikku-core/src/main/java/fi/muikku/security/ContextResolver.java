package fi.muikku.security;


public interface ContextResolver {

  boolean handlesContextReference(ContextReference contextReference);
  
}
