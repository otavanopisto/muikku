package fi.otavanopisto.muikku.plugins.guidancerequest;

import fi.otavanopisto.muikku.plugins.guidancerequest.GuidanceRequest;
import fi.otavanopisto.muikku.plugins.wall.WallFeedItem;

public class UserFeedGuidanceRequestItem extends WallFeedItem {

  private GuidanceRequest guidanceRequest;

  public UserFeedGuidanceRequestItem(GuidanceRequest guidanceRequest) {
    super(guidanceRequest.getDate());
    this.guidanceRequest = guidanceRequest;
  }

  public GuidanceRequest getGuidanceRequest() {
    return guidanceRequest;
  }
  
  @Override
  public String getType() {
    return "guidanceRequests";
  }
  
  @Override
  public String getIdentifier() {
    return getGuidanceRequest().getId().toString();
  }

}
