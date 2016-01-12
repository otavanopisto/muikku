/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package fi.muikku.plugins.googlecalendar.model;

/**
 *
 * @author Ilmo Euro <ilmo.euro@gmail.com>
 */
public class GoogleCalendar implements fi.muikku.calendar.Calendar {
  private final String summary;
  private final String description;
  private final String id;
  private final boolean writable;

  public GoogleCalendar(String summary, String description, String id, boolean writable) {
    this.summary = summary;
    this.description = description;
    this.id = id;
    this.writable = writable;
  }

  public GoogleCalendar(com.google.api.services.calendar.model.Calendar cal) {
    this(cal.getSummary(), cal.getDescription(), cal.getId(), true);
  }

  @Override
  public String getSummary() {
    return summary;
  }

  @Override
  public String getDescription() {
    return description;
  }

  @Override
  public String getId() {
    return id;
  }

  @Override
  public String getServiceProvider() {
    return "google";
  }

  @Override
  public boolean isWritable() {
    return writable;
  }

}
