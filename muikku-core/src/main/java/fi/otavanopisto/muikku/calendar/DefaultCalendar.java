package fi.otavanopisto.muikku.calendar;


public class DefaultCalendar implements Calendar {
  
  public DefaultCalendar(String id, boolean writable, String serviceProvider, String summary, String description) {
    this.id = id;
    this.writable = writable;
    this.serviceProvider = serviceProvider;
    this.summary = summary;
    this.description = description;
  }

  @Override
  public String getId() {
    return id;
  }
  
  @Override
  public boolean isWritable() {
    return writable;
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
  private boolean writable;
  private String summary;
  private String description;
}
