package fi.muikku.plugins.guidancerequest;

import java.util.Date;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.session.SessionController;


@Named
@Stateful
@RequestScoped
public class CreateGuidanceRequestBackingBean {
  
  @Inject
  private GuidanceRequestController guidanceRequestController;
  
  @Inject
  private SessionController sessionController;
  
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
