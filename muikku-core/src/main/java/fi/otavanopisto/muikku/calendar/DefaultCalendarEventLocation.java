package fi.otavanopisto.muikku.calendar;

import java.math.BigDecimal;

public class DefaultCalendarEventLocation implements CalendarEventLocation {

  public DefaultCalendarEventLocation() {
  }
  
  public DefaultCalendarEventLocation(String location, String videoCallLink, BigDecimal longitude, BigDecimal latitude) {
    this.location = location;
    this.videoCallLink = videoCallLink;
    this.longitude = longitude;
    this.latitude = latitude;
  }

  @Override
  public String getLocation() {
    return location;
  }

  @Override
  public String getVideoCallLink() {
    return videoCallLink;
  }

  @Override
  public BigDecimal getLongitude() {
    return longitude;
  }

  @Override
  public BigDecimal getLatitude() {
    return latitude;
  }

  private String location;
  private String videoCallLink;
  private BigDecimal longitude;
  private BigDecimal latitude;
}
