package fi.otavanopisto.muikku.search;

import java.util.List;

public class SearchReindexEvent {
  
  public SearchReindexEvent(List<Task> tasks, boolean resume) {
    this.tasks = tasks;
    this.resume = resume;
  }
  
  public List<Task> getTasks() {
    return tasks;
  }
  
  public boolean isResume() {
    return resume;
  }

  public void setResume(boolean resume) {
    this.resume = resume;
  }

  private List<Task> tasks;
  private boolean resume;
  
  public enum Task {
    ALL,
    USERS,
    WORKSPACES,
    USERGROUPS,
    STUDYPROGRAMMES,
    COMMUNICATORMESSAGES
  }
}
