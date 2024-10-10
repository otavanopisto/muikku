package fi.otavanopisto.muikku.rest;

import java.lang.annotation.Annotation;
import java.lang.reflect.Type;

import javax.ws.rs.ext.ParamConverter;
import javax.ws.rs.ext.ParamConverterProvider;
import javax.ws.rs.ext.Provider;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

/**
 * Provider for the ParamConverter classes in Muikku.
 */
@Provider
public class MuikkuParamConverterProvider implements ParamConverterProvider {

  @SuppressWarnings("unchecked")
  @Override
  public <T> ParamConverter<T> getConverter(Class<T> rawType, Type genericType, Annotation[] annotations) {
    if (rawType.equals(SchoolDataIdentifier.class)) {
      return (ParamConverter<T>) new SchoolDataIdentifierParamConverter();
    }
    
    return null;
  }

}
