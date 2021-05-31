package fi.otavanopisto.muikku.mock;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.google.common.base.Strings;

import fi.otavanopisto.pyramus.rest.model.Course;

public class CourseBuilder {

  private String name;
  private String description;
  private Long id;
  OffsetDateTime created = OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC);
  private OffsetDateTime lastModified = OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC);
  OffsetDateTime beginDate = OffsetDateTime.of(2000, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);
  OffsetDateTime endDate = OffsetDateTime.of(2050, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);
  private Boolean archived = false;
  private Integer courseNumber = 1;
  private Long maxParticipantCount = (long) 25;
  private String nameExtension = "test extension";
  private Double localTeachingDays = (double) 15;
  private Double teachingHours = (double) 45;
  private Double distanceTeachingHours = (double) 45;
  private Double distanceTeachingDays = (double) 15;
  private Double assessingHours = (double) 45;
  private Double planningHours = (double) 45;
  private OffsetDateTime enrolmentTimeEnd = OffsetDateTime.of(2050, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);
  private Long creatorId = (long) 1;
  private Long lastModifierId = (long) 1;
  private Long subjectId = (long) 1;
  private Double length = (double) 45;
  private Long lengthUnitId = (long) 1;
  private Long moduleId = (long) 1;
  private Long stateId = (long) 1;
  private Long typeId = (long) 1;
  private Map<String, String> variables = null;
  private List<String> tags = null;
  private Set<Long> curriculumIds = null;  
  private Long organizationId = 1L;
  private boolean courseTemplate = false;
  public CourseBuilder() { 

  }

  public Course buildCourse() throws Exception {
    if(Strings.isNullOrEmpty(name) || id == null || Strings.isNullOrEmpty(description))
      throw new Exception("Class is missing required property(ies).");
    
    return new Course(id, name, created, lastModified, description, archived, courseNumber, maxParticipantCount, beginDate,
        endDate, nameExtension, localTeachingDays, teachingHours, distanceTeachingHours, distanceTeachingDays,
        assessingHours, planningHours, enrolmentTimeEnd, creatorId, lastModifierId, subjectId, curriculumIds, length,
        lengthUnitId, moduleId, stateId, typeId, variables, tags, organizationId, courseTemplate, 1L, 1L);
  }

  public CourseBuilder name(String name)
  {
      this.name = name;
      return this;
  }

  public CourseBuilder description(String description)
  {
      this.description = description;
      return this;
  }

  public CourseBuilder id(Long id)
  {
      this.id = id;
      return this;
  }
  
  public CourseBuilder created(OffsetDateTime created)
  {
      this.created = created;
      return this;
  }
  
  public CourseBuilder lastModified(OffsetDateTime lastModified)
  {
      this.lastModified = lastModified;
      return this;
  }
  
  public CourseBuilder beginDate(OffsetDateTime beginDate)
  {
      this.beginDate = beginDate;
      return this;
  }
  
  public CourseBuilder endDate(OffsetDateTime endDate)
  {
      this.endDate = endDate;
      return this;
  }
  
  public CourseBuilder archived(Boolean archived)
  {
      this.archived = archived;
      return this;
  }
  
  public CourseBuilder courseNumber(Integer courseNumber)
  {
      this.courseNumber = courseNumber;
      return this;
  }
  
  
  public CourseBuilder maxParticipantCount(Long maxParticipantCount)
  {
      this.maxParticipantCount = maxParticipantCount;
      return this;
  }
  
  public CourseBuilder nameExtension(String nameExtension)
  {
      this.nameExtension = nameExtension;
      return this;
  }
  
  public CourseBuilder localTeachingDays(Double localTeachingDays)
  {
      this.localTeachingDays = localTeachingDays;
      return this;
  }
  
  public CourseBuilder teachingHours(Double teachingHours)
  {
      this.teachingHours = teachingHours;
      return this;
  }
  
  public CourseBuilder distanceTeachingHours(Double distanceTeachingHours)
  {
      this.distanceTeachingHours = distanceTeachingHours;
      return this;
  }

  public CourseBuilder distanceTeachingDays(Double distanceTeachingDays)
  {
      this.distanceTeachingDays = distanceTeachingDays;
      return this;
  }

  public CourseBuilder assessingHours(Double assessingHours)
  {
      this.assessingHours = assessingHours;
      return this;
  }
  public CourseBuilder planningHours(Double planningHours)
  {
      this.planningHours = planningHours;
      return this;
  }
  public CourseBuilder enrolmentTimeEnd(OffsetDateTime enrolmentTimeEnd)
  {
      this.enrolmentTimeEnd = enrolmentTimeEnd;
      return this;
  }
  public CourseBuilder creatorId(Long creatorId)
  {
      this.creatorId = creatorId;
      return this;
  }
  public CourseBuilder lastModifierId(Long lastModifierId)
  {
      this.lastModifierId = lastModifierId;
      return this;
  }
  public CourseBuilder subjectId(Long subjectId)
  {
      this.subjectId = subjectId;
      return this;
  }
  public CourseBuilder length(Double length)
  {
      this.length = length;
      return this;
  }
  public CourseBuilder lengthUnitId(Long lengthUnitId)
  {
      this.lengthUnitId = lengthUnitId;
      return this;
  }
  
  public CourseBuilder moduleId(Long moduleId)
  {
      this.moduleId = moduleId;
      return this;
  }
  
  public CourseBuilder stateId(Long stateId)
  {
      this.stateId = stateId;
      return this;
  }  
  public CourseBuilder typeId(Long typeId)
  {
      this.typeId = typeId;
      return this;
  }  
  public CourseBuilder variables(Map<String, String> variables)
  {
      this.variables = variables;
      return this;
  }  
  public CourseBuilder tags(List<String> tags)
  {
      this.tags = tags;
      return this;
  }  
  public CourseBuilder curriculumIds(Set<Long> curriculumIds)
  {
      this.curriculumIds = curriculumIds;
      return this;
  }
  public CourseBuilder organizationId(Long organizationId) {
    this.organizationId = organizationId;
    return this;
  }
}
