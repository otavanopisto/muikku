package fi.otavanopisto.muikku.search;

import java.util.List;

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
  
  public List<IndexedCommunicatorMessageLabels> getLabels(){
	  return this.labels;
  }
  
  public void setLabels(List<IndexedCommunicatorMessageLabels> labels) {
	this.labels = labels;
  }
  
  public Boolean getArchivedByReceiver() {
    return archivedByReceiver;
  }
  
  public void setArchivedByReceiver(Boolean archivedByReceiver) {
    this.archivedByReceiver = archivedByReceiver;
  }

  
  private Long userEntityId;

  private String displayName;

  private Boolean readByReceiver;
  
  private Boolean archivedByReceiver;
  
  private List<IndexedCommunicatorMessageLabels> labels;
}
