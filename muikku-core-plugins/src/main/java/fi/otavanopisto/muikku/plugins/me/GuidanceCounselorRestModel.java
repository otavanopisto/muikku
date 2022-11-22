package fi.otavanopisto.muikku.plugins.me;

import java.util.Map;

import fi.otavanopisto.muikku.rest.model.OrganizationRESTModel;
import fi.otavanopisto.muikku.rest.model.StaffMember;

public class GuidanceCounselorRestModel extends StaffMember {
  
  public GuidanceCounselorRestModel() {
  }
  
  public GuidanceCounselorRestModel(String id, Long userEntityId, String firstName, String lastName, String email,
      Map<String, String> properties, OrganizationRESTModel organization, String role, boolean hasImage, boolean chatAvailable) {
    super(id, userEntityId, firstName, lastName, email, properties, organization, role, hasImage);
    this.chatAvailable = chatAvailable;
  }
  
  public boolean isChatAvailable() {
    return chatAvailable;
  }

  public void setChatAvailable(boolean chatAvailable) {
    this.chatAvailable = chatAvailable;
  }

  private boolean chatAvailable;
}
