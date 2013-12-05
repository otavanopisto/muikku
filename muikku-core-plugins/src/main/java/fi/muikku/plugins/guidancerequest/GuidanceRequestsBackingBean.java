package fi.muikku.plugins.guidancerequest;

import java.util.Date;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import com.ocpsoft.pretty.faces.annotation.URLMapping;
import com.ocpsoft.pretty.faces.annotation.URLMappings;

import fi.muikku.session.SessionController;


@Named
@Stateful
@RequestScoped
@URLMappings(mappings = {
  @URLMapping(
      id = "guidanceRequests", 
      pattern = "/guidanceRequests/", 
      viewId = "/guidanceRequests/index.jsf")
})

public class GuidanceRequestsBackingBean {
  
  @Inject
  private GuidanceRequestController guidanceRequestController;
  
  @Inject
  private SessionController sessionController;
  
  public List<GuidanceRequest> listOwnedGuidanceRequests() {
    return guidanceRequestController.listGuidanceRequestsByStudent(sessionController.getUser());
  }
  
  public GuidanceRequest createGuidanceRequest() {
    return guidanceRequestController.createGuidanceRequest(sessionController.getUser(), new Date(), getNewGuidanceRequestMessage());
  }

  public String getNewGuidanceRequestMessage() {
    return newGuidanceRequestMessage;
  }

  public void setNewGuidanceRequestMessage(String newGuidanceRequestMessage) {
    this.newGuidanceRequestMessage = newGuidanceRequestMessage;
  }

  private String newGuidanceRequestMessage;
}
