package fi.otavanopisto.muikku.rest.model;

public class UserWhoAmIInfoServices {

  /**
   * Chat status for WhoAmI
   */
  public class ChatService {
    public ChatService(boolean isAvailable) {
      this.isAvailable = isAvailable;
    }
    public final boolean isAvailable;
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
  
  public UserWhoAmIInfoServices(boolean chatAvailable, boolean worklistAvailable, boolean environmentForumAvailable) {
    this.chat = new ChatService(chatAvailable);
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
