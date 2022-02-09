package fi.otavanopisto.muikku.plugins.calendar;

import java.time.OffsetDateTime;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.plugins.calendar.dao.CalendarEventDAO;
import fi.otavanopisto.muikku.plugins.calendar.dao.CalendarEventParticipantDAO;
import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEvent;
import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEventAttendance;
import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEventParticipant;
import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEventVisibility;
import fi.otavanopisto.muikku.session.SessionController;

public class CalendarController {
  
  @Inject
  private SessionController sessionController;

  @Inject
  private CalendarEventDAO calendarEventDAO;

  @Inject
  private CalendarEventParticipantDAO calendarEventParticipantDAO;
  
  public CalendarEvent createEvent(OffsetDateTime start, OffsetDateTime end, boolean allDay, String title, String description, CalendarEventVisibility visibility, String type) {
    Date startDate = new Date(start.toInstant().toEpochMilli());
    Date endDate = new Date(end.toInstant().toEpochMilli());
    Long userEntityId = sessionController.getLoggedUserEntity().getId();
    return calendarEventDAO.create(startDate, endDate, allDay, title, description, visibility, type, userEntityId);
  }
  
  public CalendarEvent updateEvent(CalendarEvent event, OffsetDateTime start, OffsetDateTime end, boolean allDay, String title, String description, CalendarEventVisibility visibility, String type) {
    Date startDate = new Date(start.toInstant().toEpochMilli());
    Date endDate = new Date(end.toInstant().toEpochMilli());
    return calendarEventDAO.update(event, startDate, endDate, allDay, title, description, visibility, type);
  }
  
  public void deleteEvent(CalendarEvent event) {
    List<CalendarEventParticipant> participants = calendarEventParticipantDAO.listByEvent(event);
    for (CalendarEventParticipant participant : participants) {
      calendarEventParticipantDAO.delete(participant);
    }
    calendarEventDAO.delete(event);
  }
  
  public CalendarEvent findEventById(Long eventId) {
    return calendarEventDAO.findById(eventId);
  }
  
  public boolean isEventParticipant(CalendarEvent event, Long userEntityId) {
    return calendarEventParticipantDAO.findByEventAndParticipant(event, userEntityId) != null;
  }
  
  public void removeParticipant(CalendarEventParticipant participant) {
    calendarEventParticipantDAO.delete(participant);
  }
  
  public CalendarEventParticipant findParticipant(CalendarEvent event, Long userEntityId) {
    return calendarEventParticipantDAO.findByEventAndParticipant(event, userEntityId);
  }
  
  public List<CalendarEventParticipant> listParticipants(CalendarEvent event) {
    return calendarEventParticipantDAO.listByEvent(event);
  }
  
  public void updateParticipants(CalendarEvent event, List<CalendarEventParticipant> newParticipants) {
    
    List<CalendarEventParticipant> oldParticipants = calendarEventParticipantDAO.listByEvent(event);
    
    // Add or update participants
    
    for (CalendarEventParticipant newParticipant : newParticipants) {
      CalendarEventAttendance attendance = newParticipant.getAttendance();
      if (attendance == null) {
        attendance = CalendarEventAttendance.UNCONFIRMED;
      }
      CalendarEventParticipant oldParticipant = findParticipantByUserEntityId(oldParticipants, newParticipant.getUserEntityId());
      if (oldParticipant == null) {
        calendarEventParticipantDAO.create(event, newParticipant.getUserEntityId(), attendance);
      }
      else if (oldParticipant.getAttendance() != attendance) {
        calendarEventParticipantDAO.updateAttendance(oldParticipant, attendance);
      }
    }
    
    // Remove participants
    
    for (CalendarEventParticipant oldParticipant : oldParticipants) {
      CalendarEventParticipant newParticipant = findParticipantByUserEntityId(newParticipants, oldParticipant.getUserEntityId());
      if (newParticipant == null) {
        calendarEventParticipantDAO.delete(oldParticipant);
      }
    }
  }
  
  public List<CalendarEvent> listEventsByUserAndTimeframeAndType(Long userEntityId, OffsetDateTime start, OffsetDateTime end, String type) {
    Date startDate = new Date(start.toInstant().toEpochMilli());
    Date endDate = new Date(end.toInstant().toEpochMilli());
    return StringUtils.isEmpty(type)
        ? calendarEventDAO.listByUserAndTimeframe(userEntityId, startDate, endDate)
        : calendarEventDAO.listByUserAndTimeframeAndType(userEntityId, startDate, endDate, type);
  }
  
  private CalendarEventParticipant findParticipantByUserEntityId(List<CalendarEventParticipant> participants, Long userEntityId) {
    for (CalendarEventParticipant participant : participants) {
      if (participant.getUserEntityId().equals(userEntityId)) {
        return participant;
      }
    }
    return null;
  }

}