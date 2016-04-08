package fi.otavanopisto.muikku.search;

import java.util.List;

public class SearchReindexEvent {
  
  public SearchReindexEvent(List<Task> tasks) {
    this.tasks = tasks;
  }
  
  public List<Task> getTasks() {
    return tasks;
  }
  
  private List<Task> tasks;

  public enum Task {
    USERS,
    WORKSPACES,
    USER_GROUPS
  }
}
