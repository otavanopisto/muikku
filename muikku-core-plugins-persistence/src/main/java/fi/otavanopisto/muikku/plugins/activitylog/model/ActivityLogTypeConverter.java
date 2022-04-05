package fi.otavanopisto.muikku.plugins.activitylog.model;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter
public class ActivityLogTypeConverter implements AttributeConverter<ActivityLogType, Integer> {
 
    @Override
    public Integer convertToDatabaseColumn(ActivityLogType type) {
      switch (type) {
        case EVALUATION_REQUESTED:
          return 0;
        case EVALUATION_GOTINCOMPLETED:
          return 1;
        case EVALUATION_GOTFAILED:
          return 2;
        case EVALUATION_GOTPASSED:
          return 3;
        case SESSION_LOGGEDIN:
          return 4;
        case WORKSPACE_VISIT:
          return 5;
        case MATERIAL_EXERCISEDONE:
          return 6;
        case MATERIAL_ASSIGNMENTDONE:
          return 7;
        case FORUM_NEWMESSAGE:
          return 8;
        case FORUM_NEWTHREAD:
          return 9;
        case NOTIFICATION_ASSESMENTREQUEST:
          return 10;
        case NOTIFICATION_NOPASSEDCOURSES:
          return 11;
        case NOTIFICATION_SUPPLEMENTATIONREQUEST:
          return 12;
        case NOTIFICATION_STUDYTIME:
          return 13;
        case NOTIFICATION_NEVERLOGGEDIN:
          return 14;
        case NOTIFICATION_NOLOGGEDINFORTWOMONTHS:
          return 15;
        default:
            throw new IllegalArgumentException("Unknown" + type);
      }
    }
 
    @Override
    public ActivityLogType convertToEntityAttribute(Integer dbData) {
      switch (dbData) {
        case 0:
          return ActivityLogType.EVALUATION_REQUESTED;
        case 1:
          return ActivityLogType.EVALUATION_GOTINCOMPLETED;
        case 2:
          return ActivityLogType.EVALUATION_GOTFAILED;
        case 3:
          return ActivityLogType.EVALUATION_GOTPASSED;
        case 4:
          return ActivityLogType.SESSION_LOGGEDIN;
        case 5:
          return ActivityLogType.WORKSPACE_VISIT;
        case 6:
          return ActivityLogType.MATERIAL_EXERCISEDONE;
        case 7:
          return ActivityLogType.MATERIAL_ASSIGNMENTDONE;
        case 8:
          return ActivityLogType.FORUM_NEWMESSAGE;
        case 9:
          return ActivityLogType.FORUM_NEWTHREAD;
        case 10:
          return ActivityLogType.NOTIFICATION_ASSESMENTREQUEST;
        case 11:
          return ActivityLogType.NOTIFICATION_NOPASSEDCOURSES;
        case 12:
          return ActivityLogType.NOTIFICATION_SUPPLEMENTATIONREQUEST;
        case 13:
          return ActivityLogType.NOTIFICATION_STUDYTIME;
        case 14:
          return ActivityLogType.NOTIFICATION_NEVERLOGGEDIN;
        case 15:
          return ActivityLogType.NOTIFICATION_NOLOGGEDINFORTWOMONTHS;
        default:
            throw new IllegalArgumentException("Unknown" + dbData);
      }
    }
  }