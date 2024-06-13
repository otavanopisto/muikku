package fi.otavanopisto.muikku.rest;

import javax.ws.rs.BadRequestException;
import javax.ws.rs.ext.ParamConverter;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

/**
 * ParamConverter for SchoolDataIdentifier.
 * 
 * Converts between String and SchoolDataIdentifier via the
 * SchoolDataIdentifier.fromId() and SchoolDataIdentifier.toId()
 * methods. I.e. the string needs to be in id form.
 */
public class SchoolDataIdentifierParamConverter implements ParamConverter<SchoolDataIdentifier> {

  @Override
  public SchoolDataIdentifier fromString(String value) {
    /*
     * If the value is blank, return null - this is probably bit of a compromise
     * as sometimes it could warrant a Bad Request, but maybe those cases are
     * left to the endpoint to validate.
     */
    if (StringUtils.isBlank(value)) {
      return null;
    }
    
    SchoolDataIdentifier schoolDataIdentifier = SchoolDataIdentifier.fromId(value);
    
    // Value exists, but it couldn't be parsed into a SchoolDataIdentifier, return bad request
    if (schoolDataIdentifier == null) {
      throw new BadRequestException();
    }
    
    return schoolDataIdentifier;
  }

  @Override
  public String toString(SchoolDataIdentifier value) {
    return value != null ? value.toId() : null;
  }

}
