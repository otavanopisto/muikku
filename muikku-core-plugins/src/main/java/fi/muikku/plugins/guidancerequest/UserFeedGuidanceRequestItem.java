package fi.muikku.plugins.guidancerequest;

import fi.muikku.plugins.wall.WallFeedItem;

public class UserFeedGuidanceRequestItem extends WallFeedItem {

  private GuidanceRequest guidanceRequest;

  public UserFeedGuidanceRequestItem(GuidanceRequest guidanceRequest) {
    super(guidanceRequest.getDate());
    this.guidanceRequest = guidanceRequest;
  }

  public GuidanceRequest getGuidanceRequest() {
    return guidanceRequest;
  }

}
