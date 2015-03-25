package fi.muikku.plugins.guidance;

import java.util.Date;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;

import fi.muikku.session.SessionController;


@Named
@Stateful
@RequestScoped
@Join (path = "/guidanceRequests/", to = "/guidanceRequests/index.jsf")
public class GuidanceRequestsBackingBean {
  
  @Inject
  private GuidanceRequestController guidanceRequestController;
  
  @Inject
  private SessionController sessionController;
  
  public List<GuidanceRequest> listOwnedGuidanceRequests() {
    return guidanceRequestController.listGuidanceRequestsByStudent(sessionController.getLoggedUserEntity());
  }
  
  public GuidanceRequest createGuidanceRequest() {
    return guidanceRequestController.createGuidanceRequest(sessionController.getLoggedUserEntity(), new Date(), getNewGuidanceRequestMessage());
  }

  public String getNewGuidanceRequestMessage() {
    return newGuidanceRequestMessage;
  }

  public void setNewGuidanceRequestMessage(String newGuidanceRequestMessage) {
    this.newGuidanceRequestMessage = newGuidanceRequestMessage;
  }

  private String newGuidanceRequestMessage;
}
