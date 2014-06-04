package fi.muikku.calendar;


public class DefaultCalendar implements Calendar {
  
  public DefaultCalendar(String id, String serviceProvider, String summary, String description) {
    this.id = id;
    this.serviceProvider = serviceProvider;
    this.summary = summary;
    this.description = description;
  }

  @Override
  public String getId() {
    return id;
  }

  @Override
  public String getServiceProvider() {
    return serviceProvider;
  }

  @Override
  public String getSummary() {
    return summary;
  }

  @Override
  public String getDescription() {
    return description;
  }

  private String id;
  private String serviceProvider;
  private String summary;
  private String description;
}
