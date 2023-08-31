package fi.otavanopisto.muikku.rest.model;

public class UserWhoAmIInfoServices {

  /**
   * Chat status for WhoAmI
   */
  public class ChatService {
    public ChatService(boolean isAvailable, boolean isActive) {
      this.isAvailable = isAvailable;
      this.isActive = isActive;
    }
    public final boolean isAvailable;
    public final boolean isActive;
  }
  
  /**
   * Worklist status for WhoAmI
   */
  public class WorklistService {
    public WorklistService(boolean isAvailable) {
      this.isAvailable = isAvailable;
    }
    public final boolean isAvailable;
  }

  /**
   * Environment forum status for WhoAmI
   */
  public class EnvironmentForumService {
    public EnvironmentForumService(boolean isAvailable) {
      this.isAvailable = isAvailable;
    }
    public final boolean isAvailable;
  }
  
  public UserWhoAmIInfoServices(boolean chatAvailable, boolean chatActive, boolean worklistAvailable, boolean environmentForumAvailable) {
    this.chat = new ChatService(chatAvailable, chatActive);
    this.worklist = new WorklistService(worklistAvailable);
    this.environmentForum = new EnvironmentForumService(environmentForumAvailable);
  }
  
  public ChatService getChat() {
    return chat;
  }
  
  public WorklistService getWorklist() {
    return worklist;
  }

  public EnvironmentForumService getEnvironmentForum() {
    return environmentForum;
  }

  private final ChatService chat;
  private final WorklistService worklist;
  private final EnvironmentForumService environmentForum;

}
