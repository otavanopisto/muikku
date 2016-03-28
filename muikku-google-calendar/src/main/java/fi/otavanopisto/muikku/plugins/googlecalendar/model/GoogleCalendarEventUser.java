/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package fi.otavanopisto.muikku.plugins.googlecalendar.model;

import fi.otavanopisto.muikku.calendar.CalendarEventUser;

/**
 *
 * @author Ilmo Euro <ilmo.euro@gmail.com>
 */
public class GoogleCalendarEventUser implements CalendarEventUser {
  private final String displayName;
  private final String email;

  public GoogleCalendarEventUser(String displayName, String email) {
    this.displayName = displayName;
    this.email = email;
  }

  @Override
  public String getDisplayName() {
    return displayName;
  }

  @Override
  public String getEmail() {
    return email;
  }

}
