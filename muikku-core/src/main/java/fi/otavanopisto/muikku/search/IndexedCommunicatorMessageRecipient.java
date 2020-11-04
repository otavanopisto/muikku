package fi.otavanopisto.muikku.search;

import java.util.List;

import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageIdLabel;

public class IndexedCommunicatorMessageRecipient{

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }
  
  public Boolean getReadByReceiver() {
	return readByReceiver;
  }
  
  public void setReadByReceiver(Boolean readByReceiver) {
	this.readByReceiver = readByReceiver;
  }

  public String getDisplayName() {
    return displayName;
  }

  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }
  
  public List<CommunicatorMessageIdLabel> getLabels(){
	  return this.labels;
  }
  
  public void setLabels(List<CommunicatorMessageIdLabel> labels) {
	this.labels = labels;
  }

  
  private Long userEntityId;

  private String displayName;

  private Boolean readByReceiver;
  
  private List<CommunicatorMessageIdLabel> labels;
}
