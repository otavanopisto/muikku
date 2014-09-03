package fi.muikku.auth;

public class LoginEvent {
  
  public LoginEvent(String strategy, Long userId) {
    this.strategy = strategy;
    this.userId = userId;
  }

  public String getStrategy() {
    return strategy;
  }
  
  public Long getUserId() {
    return userId;
  }

  private String strategy;
  private Long userId;
}
