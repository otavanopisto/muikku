package fi.muikku.calendar;

public interface Calendar {

  /**
   * Returns calendar identifier
   * 
   * Identifier must be unique within service provider.
   * 
   * @return calendar identifier
   */
  public String getId();
  
  /**
   * Returns name of calendar service provider
   * 
   * @return name of calendar service provider
   */
  public String getServiceProvider();
  
  /**
   * Returns a summary (title) of the calendar
   * 
   * @return a summary (title) of the calendar
   */
  public String getSummary();
  
  /**
   * Returns description of the calendar
   * 
   * @return description of the calendar
   */
  public String getDescription();
  
}