package fi.otavanopisto.muikku.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.otavanopisto.muikku.rest.AbstractCoreRESTService;

public class AbstractRESTService extends AbstractCoreRESTService {

  protected Response getConstraintViolations(ConstraintViolationException violationException) {
    List<Map<String, Object>> violationMessages = new ArrayList<Map<String,Object>>();
    
    Set<ConstraintViolation<?>> constraintViolations = violationException.getConstraintViolations();
    for (ConstraintViolation<?> constraintViolation : constraintViolations) {
      Map<String, Object> violationMessage = new HashMap<String, Object>();

      violationMessage.put("invalidValue", constraintViolation.getInvalidValue());
      violationMessage.put("propertyPath", constraintViolation.getPropertyPath().toString());
      violationMessage.put("message", constraintViolation.getMessage());
      violationMessage.put("entity", constraintViolation.getLeafBean().getClass().getSimpleName());
      
      violationMessages.add(violationMessage);
    }
    
    Map<String, List<Map<String, Object>>> result = new HashMap<String, List<Map<String,Object>>>();
    result.put("constraintViolations", violationMessages);
    
    return Response.status(Status.PRECONDITION_FAILED).entity(result).build();

  }
  
}
