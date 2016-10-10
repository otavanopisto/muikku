package fi.otavanopisto.muikku.plugins.communicator.rest;

import java.util.Date;
import java.util.Set;

public class CommunicatorMessageRESTModel extends AbstractCommunicatorMessageRESTModel {

  public CommunicatorMessageRESTModel() {
  }
  
  public CommunicatorMessageRESTModel(Long id, Long communicatorMessageId, Long senderId, String categoryName, String caption, 
      String content, Date created, Set<String> tags) {
    super(id, communicatorMessageId, senderId, categoryName, caption, content, created, tags);
  }
  
}
