package fi.otavanopisto.muikku.plugins.exam.rest;

import java.util.List;

import fi.otavanopisto.muikku.plugins.workspace.ContentNode;

public class ExamContents {

  public List<ContentNode> getMaterials() {
    return materials;
  }

  public void setMaterials(List<ContentNode> materials) {
    this.materials = materials;
  }

  public boolean isLocked() {
    return locked;
  }

  public void setLocked(boolean locked) {
    this.locked = locked;
  }

  private List<ContentNode> materials;
  private boolean locked;

}
