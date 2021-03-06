package fi.otavanopisto.muikku.plugins.schooldatapyramus;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.inject.Inject;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusSchoolDataEntityFactory;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.PyramusClient;
import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeInternalException;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceSchoolDataBridge;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceType;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser;
import fi.otavanopisto.muikku.schooldata.payload.WorklistItemBilledPriceRestModel;
import fi.otavanopisto.pyramus.rest.model.Course;
import fi.otavanopisto.pyramus.rest.model.CourseDescription;
import fi.otavanopisto.pyramus.rest.model.CourseOptionality;
import fi.otavanopisto.pyramus.rest.model.CourseParticipationType;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMember;
import fi.otavanopisto.pyramus.rest.model.CourseStudent;
import fi.otavanopisto.pyramus.rest.model.course.CourseSignupStudentGroup;
import fi.otavanopisto.pyramus.rest.model.course.CourseSignupStudyProgramme;

public class PyramusWorkspaceSchoolDataBridge implements WorkspaceSchoolDataBridge {
  
  @Inject
  private Logger logger;

  @Inject
  private PyramusClient pyramusClient;

  @Inject
  private PyramusIdentifierMapper identifierMapper;
  
  @Inject
  private PyramusSchoolDataEntityFactory entityFactory;
  
  @Inject
  private PyramusStudentActivityMapper pyramusStudentActivityMapper;
  
  @Inject
  private WorkspaceDiscoveryWaiter workspaceDiscoveryWaiter;
  
  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

  @Override
  public Workspace createWorkspace(String name, String description, WorkspaceType type, String courseIdentifierIdentifier) {
    if (StringUtils.isBlank(name)) {
      throw new SchoolDataBridgeInternalException("Name is required");
    }
    
    if (name.length() > 255) {
      throw new SchoolDataBridgeInternalException("Name maximum length is 255 characters");
    }
    
    throw new SchoolDataBridgeInternalException("Not implemented");
  }

  @Override
  public Workspace copyWorkspace(SchoolDataIdentifier sourceWorkspaceIdentifier, String name, String nameExtension, String description, SchoolDataIdentifier destinationOrganizationIdentifier) {
    if (!getSchoolDataSource().equals(sourceWorkspaceIdentifier.getDataSource())) {
      logger.severe(String.format("Invalid workspace identfier for Pyramus bridge", sourceWorkspaceIdentifier));
      return null;
    }
    
    Long pyramusCourseId = identifierMapper.getPyramusCourseId(sourceWorkspaceIdentifier.getIdentifier());
    if (pyramusCourseId == null) {
      logger.severe(String.format("Workspace identifier %s is not valid", sourceWorkspaceIdentifier));
      return null;
    }
    
    Course course = pyramusClient.get(String.format("/courses/courses/%d", pyramusCourseId), Course.class);
    if (course == null) {
      logger.severe(String.format("Could not find Pyramus course by id %d", pyramusCourseId));
      return null;
    }
    
    List<String> copiedTags = null;
    if (course.getTags() != null) {
      copiedTags = new ArrayList<String>();
      for (String tag : course.getTags()) {
        copiedTags.add(tag);
      }
    }

    Long pyramusOrganizationId = identifierMapper.getPyramusOrganizationId(destinationOrganizationIdentifier.getIdentifier());
    if (pyramusOrganizationId == null) {
      logger.severe(String.format("Organization identifier %s is not valid", destinationOrganizationIdentifier));
      return null;
    }

    OffsetDateTime now = OffsetDateTime.now();
    
    Course courseCopy = new Course(
        null, // copy has no id
        name, // copy has new name
        now, // Created
        now, // Last modified
        description, // copy has new description
        course.getArchived(),
        course.getCourseNumber(),
        course.getMaxParticipantCount(),
        course.getBeginDate(),
        course.getEndDate(),
        nameExtension, // copy has new name extension
        course.getLocalTeachingDays(),
        course.getTeachingHours(),
        course.getDistanceTeachingHours(),
        course.getDistanceTeachingDays(),
        course.getAssessingHours(),
        course.getPlanningHours(),
        course.getEnrolmentTimeEnd(),
        course.getCreatorId(),
        course.getLastModifierId(),
        course.getSubjectId(),
        course.getCurriculumIds(),
        course.getLength(),
        course.getLengthUnitId(),
        course.getModuleId(),
        course.getStateId(),
        course.getTypeId(),
        null, // variables are not copied
        copiedTags, // copy has its own tag list
        pyramusOrganizationId,
        false, // CourseTemplate - never a template when created from Muikku
        course.getPrimaryEducationTypeId(),
        course.getPrimaryEducationSubtypeId()
    ); // 
    
    Course createdCourse = pyramusClient.post("/courses/courses/", courseCopy);
    if (createdCourse == null) {
      logger.severe(String.format("Failed to create new course based on course %d", pyramusCourseId));
      return null;
    }

    // #2915: Copy additional course descriptions
    
    CourseDescription[] courseDescriptions = pyramusClient.get(String.format("/courses/courses/%d/descriptions", pyramusCourseId), CourseDescription[].class);
    if (ArrayUtils.isNotEmpty(courseDescriptions)) {
      for (int i = 0; i < courseDescriptions.length; i++) {
        pyramusClient.post(
          String.format("/courses/courses/%d/descriptions", createdCourse.getId()),
          new CourseDescription(
            null,
            createdCourse.getId(),
            courseDescriptions[i].getCourseDescriptionCategoryId(),
            courseDescriptions[i].getDescription()));
      }
    }
    
    SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(identifierMapper.getWorkspaceIdentifier(createdCourse.getId()), SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    workspaceDiscoveryWaiter.waitDiscovered(workspaceIdentifier);
    
    return createWorkspaceEntity(createdCourse);
  }
  
  @Override
  public Workspace findWorkspace(String identifier) {
    Long pyramusCourseId = identifierMapper.getPyramusCourseId(identifier);
    if (pyramusCourseId == null) {
      logger.severe(String.format("Workspace identifier %s is not valid", identifier));
      return null;
    }
    
    return createWorkspaceEntity(pyramusClient.get(String.format("/courses/courses/%d", pyramusCourseId), Course.class));
  }

  @Override
  public List<Workspace> listWorkspaces() {
    List<Workspace> result = new ArrayList<Workspace>();
    Course[] courses = pyramusClient.get("/courses/courses/", Course[].class);
    if (courses != null) {
      for (Course course : courses) {
        result.add(createWorkspaceEntity(course));
      }
    }
    return result;
  }

  @Override
  public List<Workspace> listWorkspacesByCourseIdentifier(String courseIdentifierIdentifier) {
    if (courseIdentifierIdentifier.indexOf("/") == -1)
      throw new SchoolDataBridgeInternalException("Invalid CourseIdentifierId");
    
    String subjectId = courseIdentifierIdentifier.substring(0, courseIdentifierIdentifier.indexOf("/"));
    String courseNumber = courseIdentifierIdentifier.substring(courseIdentifierIdentifier.indexOf("/") + 1);
    
    Course[] courses = pyramusClient.get("/common/subjects/" + subjectId + "/courses", fi.otavanopisto.pyramus.rest.model.Course[].class);
    List<Workspace> result = new ArrayList<Workspace>();
    
    for (Course course : courses) {
      String courseNumber2 = course.getCourseNumber() != null ? course.getCourseNumber().toString() : "null";

      if (courseNumber.equals(courseNumber2))
        result.add(createWorkspaceEntity(course));
    }
    
    return result;
  }

  @Override
  public Workspace updateWorkspace(Workspace workspace) {
    Long pyramusCourseId = identifierMapper.getPyramusCourseId(workspace.getIdentifier());
    if (pyramusCourseId == null) {
      logger.severe(String.format("Workspace identifier %s is not valid", workspace.getIdentifier()));
      return null;
    }
    
    Long typeId = identifierMapper.getPyramusCourseTypeId(workspace.getWorkspaceTypeId());
    Long lengthUnitId = identifierMapper.getPyramusEducationalTimeUnitId(workspace.getLengthUnitIdentifier());
    Long subjectId = identifierMapper.getPyramusSubjectId(workspace.getSubjectIdentifier());
    
    Course course = pyramusClient.get(String.format("/courses/courses/%d", pyramusCourseId), Course.class);
    
    course.setName(workspace.getName());
    course.setNameExtension(workspace.getNameExtension());
    course.setDescription(workspace.getDescription());
    course.setBeginDate(workspace.getBeginDate());
    course.setEndDate(workspace.getEndDate());
    course.setLength(workspace.getLength());
    course.setLengthUnitId(lengthUnitId);
    course.setTypeId(typeId);
    course.setSubjectId(subjectId);
    
    Course updatedCourse = pyramusClient.put(String.format("/courses/courses/%d", pyramusCourseId), course);
    if (updatedCourse == null) {
      logger.severe(String.format("Workspace %s updating failed", workspace.getIdentifier()));
      return null;
    }
    
    return createWorkspaceEntity(updatedCourse);
  }

  @Override
  public void removeWorkspace(String identifier) {
    if (!StringUtils.isNumeric(identifier)) {
      throw new SchoolDataBridgeInternalException("Identifier has to be numeric");
    }

    throw new SchoolDataBridgeInternalException("Not implemented");
  }

  @Override
  public WorkspaceType findWorkspaceType(String identifier) {
    if (identifier == null) {
      return null;
    }
    
    if (!StringUtils.isNumeric(identifier)) {
      throw new SchoolDataBridgeInternalException("Identifier has to be numeric");
    }
    
    return entityFactory.createEntity(pyramusClient.get("/courses/courseTypes/" + identifier, fi.otavanopisto.pyramus.rest.model.CourseType.class));
  }
  
  @Override
  public List<WorkspaceType> listWorkspaceTypes() {
    return entityFactory.createEntities(pyramusClient.get("/courses/courseTypes/", fi.otavanopisto.pyramus.rest.model.CourseType[].class));
  }

  @Override
  public WorkspaceUser createWorkspaceUser(Workspace workspace, User user, String roleSchoolDataSource, String roleIdentifier) {
    Long courseId = identifierMapper.getPyramusCourseId(workspace.getIdentifier());
    String roleId = identifierMapper.getPyramusCourseRoleId(roleIdentifier);

    if (StringUtils.equals(roleId, "STUDENT")) {
      Long studentId = identifierMapper.getPyramusStudentId(user.getIdentifier());
      CourseStudent courseStudent = new CourseStudent(null, courseId, studentId, OffsetDateTime.now(), Boolean.FALSE, null, null, Boolean.FALSE, CourseOptionality.OPTIONAL, null);
      
      return Arrays.asList(entityFactory.createEntity(pyramusClient.post("/courses/courses/" + courseId + "/students", courseStudent))).get(0);
    } else {
      Long staffMemberId = identifierMapper.getPyramusStaffId(user.getIdentifier());
      
      if (NumberUtils.isNumber(roleId) && (staffMemberId != null)) {
        CourseStaffMember courseStaffMember = new CourseStaffMember(null, courseId, staffMemberId, NumberUtils.createLong(roleId));
        return entityFactory.createEntity(pyramusClient.post("/courses/courses/" + courseId + "/staffMembers", courseStaffMember));
      } else {
        logger.severe(String.format("Given staff member role could not be parsed: %s, %s", roleIdentifier, user.getIdentifier()));
        throw new RuntimeException("Could not parse workspace staff member role");
      }
    }
  }
  
  @Override
  public WorkspaceUser findWorkspaceUser(SchoolDataIdentifier workspaceIdentifier, SchoolDataIdentifier workspaceUserIdentifier) {
    if (!StringUtils.equals(workspaceIdentifier.getDataSource(), getSchoolDataSource())) {
      throw new SchoolDataBridgeInternalException("Invalid school data source");
    }
    
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier.getIdentifier());
    Long courseStudentId = identifierMapper.getPyramusCourseStudentId(workspaceUserIdentifier.getIdentifier());
    
    return Arrays.asList(entityFactory.createEntity(pyramusClient.get(String.format("/courses/courses/%d/students/%d", courseId, courseStudentId), CourseStudent.class))).get(0);
  }

  @Override
  public WorkspaceUser findWorkspaceUserByWorkspaceAndUser(SchoolDataIdentifier workspaceIdentifier, SchoolDataIdentifier userIdentifier) {
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier.getIdentifier());
    Long userId = identifierMapper.getPyramusStudentId(userIdentifier.getIdentifier());
    if (courseId != null && userId != null) {
      List<WorkspaceUser> users = entityFactory.createEntity(pyramusClient.get(String.format("/courses/courses/%d/students?studentId=%d", courseId, userId), CourseStudent[].class));
      if (users != null) {
        if (users.size() > 1) {
          logger.warning(String.format("Student %d appears %d times in course %d", userId, users.size(), courseId));
        }
        return users.isEmpty() ? null : users.get(0);
      }
    }
    else {
      logger.severe(String.format("null courseId %d or userId %d", courseId, userId));
    }
    return null;
  }
  
  @Override
  public List<WorkspaceUser> listWorkspaceUsers(String workspaceIdentifier) {
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    
    CourseStaffMember[] staffMembers = pyramusClient.get("/courses/courses/" + courseId + "/staffMembers", CourseStaffMember[].class);
    CourseStudent[] courseStudents = pyramusClient.get("/courses/courses/" + courseId + "/students", CourseStudent[].class);
    
    List<WorkspaceUser> result = entityFactory.createEntity(staffMembers);
    result.addAll(entityFactory.createEntity(courseStudents));
    
    return result;
  }
  
  private Workspace createWorkspaceEntity(Course course) {
    if (course == null) {
      return null;
    }
    return entityFactory.createEntity(course);
  }

  @Override
  public List<WorkspaceUser> listWorkspaceStaffMembers(String workspaceIdentifier) {
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    if (courseId != null) {
      CourseStaffMember[] staffMembers = pyramusClient.get(String.format("/courses/courses/%d/staffMembers", courseId), CourseStaffMember[].class);
      if (staffMembers != null) {
        return entityFactory.createEntity(staffMembers);
      }
    }
    return Collections.<WorkspaceUser>emptyList();
  }

  @Override
  public List<WorkspaceUser> listWorkspaceStudents(String workspaceIdentifier) {
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    CourseStudent[] students = pyramusClient.get(String.format("/courses/courses/%d/students?activeStudents=true", courseId), CourseStudent[].class);
    if (students != null) {
      return entityFactory.createEntity(students);
    }
    return Collections.<WorkspaceUser>emptyList();
  }

  @Override
  public List<WorkspaceUser> listWorkspaceStudents(String workspaceIdentifier, boolean active) {
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier);
    String participationTypes = active ? pyramusStudentActivityMapper.getActiveCDT() : pyramusStudentActivityMapper.getInactiveCDT();
    if (StringUtils.isEmpty(participationTypes)) {
      logger.warning(String.format("Undefined plugin setting:%s-participationTypes.workspace.(in)active", SchoolDataPyramusPluginDescriptor.PLUGIN_NAME));
    }
    else {
      CourseStudent[] students = pyramusClient.get(String.format("/courses/courses/%d/students?participationTypes=%s", courseId, participationTypes), CourseStudent[].class);
      if (students != null) {
        return entityFactory.createEntity(students);
      }
    }
    return Collections.<WorkspaceUser>emptyList();
  }

  @Override
  public void updateWorkspaceStudentActivity(WorkspaceUser workspaceUser, boolean active) {
    Long courseId = identifierMapper.getPyramusCourseId(workspaceUser.getWorkspaceIdentifier().getIdentifier());
    Long courseStudentId = identifierMapper.getPyramusCourseStudentId(workspaceUser.getIdentifier().getIdentifier());
    CourseStudent courseStudent = pyramusClient.get(String.format("/courses/courses/%d/students/%d", courseId, courseStudentId), CourseStudent.class);
    if (courseStudent != null) {
      Long currentParticipationType = courseStudent.getParticipationTypeId();
      if (pyramusStudentActivityMapper.isActive(currentParticipationType) != active) {
        Long newParticipationType = active ? pyramusStudentActivityMapper.toActive(currentParticipationType) : pyramusStudentActivityMapper.toInactive(currentParticipationType);
        if (newParticipationType == null) {
          newParticipationType = currentParticipationType;
        }
        CourseParticipationType participationType = pyramusClient.get(String.format("/courses/participationTypes/%d", newParticipationType), CourseParticipationType.class);
        if (participationType != null) {
          courseStudent.setParticipationTypeId(participationType.getId());
          pyramusClient.put(String.format("/courses/courses/%d/students/%d", courseId, courseStudentId), courseStudent);
        } else {
          logger.warning(String.format("Could not find participation type %d", newParticipationType));
        }
      }
    }
  }

  @Override
  public Set<SchoolDataIdentifier> listWorkspaceSignupGroups(SchoolDataIdentifier workspaceIdentifier) {
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier.getIdentifier());
    
    CourseSignupStudyProgramme[] signupStudyProgrammes = pyramusClient.get(String.format("/courses/courses/%d/signupStudyProgrammes", courseId), CourseSignupStudyProgramme[].class);
    Set<SchoolDataIdentifier> signupStudyProgrammeIdentifiers = Arrays.stream(signupStudyProgrammes)
      .map(signupStudyProgramme -> identifierMapper.getStudyProgrammeIdentifier(signupStudyProgramme.getStudyProgrammeId()))
      .collect(Collectors.toSet());
    
    CourseSignupStudentGroup[] signupStudentGroups = pyramusClient.get(String.format("/courses/courses/%d/signupStudentGroups", courseId), CourseSignupStudentGroup[].class);
    Set<SchoolDataIdentifier> signupStudentGroupIdentifiers = Arrays.stream(signupStudentGroups)
        .map(signupStudentGroup -> new SchoolDataIdentifier(identifierMapper.getStudentGroupIdentifier(signupStudentGroup.getStudentGroupId()), SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE))
        .collect(Collectors.toSet());
    
    Set<SchoolDataIdentifier> signupGroupIdentifiers = new HashSet<>();
    signupGroupIdentifiers.addAll(signupStudyProgrammeIdentifiers);
    signupGroupIdentifiers.addAll(signupStudentGroupIdentifiers);
    return signupGroupIdentifiers;
  }

  @Override
  public void addWorkspaceSignupGroup(SchoolDataIdentifier workspaceIdentifier,
      SchoolDataIdentifier userGroupIdentifier) {
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier.getIdentifier());

    switch (identifierMapper.getStudentGroupType(userGroupIdentifier.getIdentifier())) {
      case STUDYPROGRAMME:
        Long studyProgrammeId = identifierMapper.getPyramusStudyProgrammeId(userGroupIdentifier.getIdentifier());
        CourseSignupStudyProgramme signupStudyProgramme = new CourseSignupStudyProgramme(null, courseId, studyProgrammeId, null);
        pyramusClient.post(String.format("/courses/courses/%d/signupStudyProgrammes", courseId), signupStudyProgramme);
      break;
      case STUDENTGROUP:
        Long studentGroupId = identifierMapper.getPyramusStudentGroupId(userGroupIdentifier.getIdentifier());
        CourseSignupStudentGroup signupStudentGroup = new CourseSignupStudentGroup(null, courseId, studentGroupId, null);
        pyramusClient.post(String.format("/courses/courses/%d/signupStudentGroups", courseId), signupStudentGroup);
      break;
    }
  }

  @Override
  public void removeWorkspaceSignupGroup(SchoolDataIdentifier workspaceIdentifier,
      SchoolDataIdentifier userGroupIdentifier) {
    Long courseId = identifierMapper.getPyramusCourseId(workspaceIdentifier.getIdentifier());

    switch (identifierMapper.getStudentGroupType(userGroupIdentifier.getIdentifier())) {
      case STUDYPROGRAMME:
        Long studyProgrammeId = identifierMapper.getPyramusStudyProgrammeId(userGroupIdentifier.getIdentifier());
        CourseSignupStudyProgramme[] signupStudyProgrammes = pyramusClient.get(String.format("/courses/courses/%d/signupStudyProgrammes", courseId), CourseSignupStudyProgramme[].class);
        CourseSignupStudyProgramme existingStudyProgrammeGroup = Arrays.stream(signupStudyProgrammes)
            .filter(signupStudyProgramme -> Objects.equals(studyProgrammeId, signupStudyProgramme.getStudyProgrammeId()))
            .findFirst()
            .orElse(null);

        if (existingStudyProgrammeGroup != null) {
          pyramusClient.delete(String.format("/courses/courses/%d/signupStudyProgrammes/%d", courseId, existingStudyProgrammeGroup.getId()));
        } else {
          logger.warning(String.format("Cannot remove signup studentgroup %s as it didn't exist for course %d", userGroupIdentifier.getIdentifier(), courseId));
        }
      break;
      case STUDENTGROUP:
        Long studentGroupId = identifierMapper.getPyramusStudentGroupId(userGroupIdentifier.getIdentifier());
        CourseSignupStudentGroup[] signupStudentGroups = pyramusClient.get(String.format("/courses/courses/%d/signupStudentGroups", courseId), CourseSignupStudentGroup[].class);
        CourseSignupStudentGroup existingStudentGroup = Arrays.stream(signupStudentGroups)
          .filter(signupStudentGroup -> Objects.equals(studentGroupId, signupStudentGroup.getStudentGroupId()))
          .findFirst()
          .orElse(null);

        if (existingStudentGroup != null) {
          pyramusClient.delete(String.format("/courses/courses/%d/signupStudentGroups/%d", courseId, existingStudentGroup.getId()));
        } else {
          logger.warning(String.format("Cannot remove signup studentgroup %s as it didn't exist for course %d", userGroupIdentifier.getIdentifier(), courseId));
        }
      break;
    }
  }

  @Override
  public Double getWorkspaceBasePrice(String workspaceIdentifier) {
    return pyramusClient.responseGet(String.format("/worklist/basePrice?course=%s", workspaceIdentifier), Double.class).getEntity();
  }

  @Override
  public BridgeResponse<WorklistItemBilledPriceRestModel> getWorkspaceBilledPrice(String courseAssessmentIdentifier) {
    Long courseAssessmentId = identifierMapper.getPyramusCourseAssessmentId(courseAssessmentIdentifier);
    BridgeResponse<WorklistItemBilledPriceRestModel> response = pyramusClient.responseGet(
        String.format("/worklist/billedPrice?courseAssessment=%d", courseAssessmentId),
        WorklistItemBilledPriceRestModel.class);
    if (response.getEntity() != null) {
      response.getEntity().setAssessmentIdentifier(courseAssessmentIdentifier);
    }
    return response;
  }
  
  @Override
  public BridgeResponse<WorklistItemBilledPriceRestModel> updateWorkspaceBilledPrice(WorklistItemBilledPriceRestModel payload) {
    
    // Identifier to Pyramus id...
    
    SchoolDataIdentifier workspaceAssessmentIdentifier = SchoolDataIdentifier.fromId(payload.getAssessmentIdentifier());
    String originalIdentifier = payload.getAssessmentIdentifier();
    Long courseAssessmentId = identifierMapper.getPyramusCourseAssessmentId(workspaceAssessmentIdentifier.getIdentifier());
    payload.setAssessmentIdentifier(courseAssessmentId.toString());
    
    // ...update...
    
    BridgeResponse<WorklistItemBilledPriceRestModel> response = pyramusClient.responsePut(
        "/worklist/billedPrice",
        Entity.entity(payload, MediaType.APPLICATION_JSON),
        WorklistItemBilledPriceRestModel.class);
    
    // Pyramus id back to original identifier
    
    if (response.getEntity() != null) {
      response.getEntity().setAssessmentIdentifier(originalIdentifier);
    }
    return response;
  }

}
