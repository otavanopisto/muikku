package fi.otavanopisto.muikku.plugins.exam.rest;

import java.util.List;

public class ExamSettingsCategory {
  
  public ExamSettingsCategory() {
  }

  public ExamSettingsCategory(String name, List<Long> workspaceMaterialIds, int randomCount) {
    this.name = name;
    this.workspaceMaterialIds = workspaceMaterialIds;
    this.randomCount = randomCount;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public List<Long> getWorkspaceMaterialIds() {
    return workspaceMaterialIds;
  }

  public void setWorkspaceMaterialIds(List<Long> workspaceMaterialIds) {
    this.workspaceMaterialIds = workspaceMaterialIds;
  }

  public int getRandomCount() {
    return randomCount;
  }

  public void setRandomCount(int randomCount) {
    this.randomCount = randomCount;
  }

  // Category name
  private String name;
  
  // List of page (assignment) ids belonging to this category
  private List<Long> workspaceMaterialIds;
  
  // Number of assignments to randomly select from this category when settings random = CATEGORY
  private int randomCount;

}
