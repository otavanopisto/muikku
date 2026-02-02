package fi.otavanopisto.muikku.mock;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.equalTo;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.matching;
import static com.github.tomakehurst.wiremock.client.WireMock.post;
import static com.github.tomakehurst.wiremock.client.WireMock.put;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.github.tomakehurst.wiremock.client.WireMock.urlMatching;
import static com.github.tomakehurst.wiremock.client.WireMock.urlPathEqualTo;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.github.tomakehurst.wiremock.admin.model.ListStubMappingsResult;
import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.matching.UrlPathPattern;
import com.github.tomakehurst.wiremock.stubbing.ServeEvent;
import com.github.tomakehurst.wiremock.stubbing.StubMapping;
import com.google.common.hash.Hashing;

import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.atests.CeeposPaymentResponseRestModel;
import fi.otavanopisto.muikku.atests.HopsCourseMatrix;
import fi.otavanopisto.muikku.atests.HopsCourseMatrixProblem;
import fi.otavanopisto.muikku.atests.HopsCourseMatrixType;
import fi.otavanopisto.muikku.atests.PyramusMatriculationExam;
import fi.otavanopisto.muikku.mock.model.MockCourseStudent;
import fi.otavanopisto.muikku.mock.model.MockLoggable;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.pyramus.rest.model.ContactType;
import fi.otavanopisto.pyramus.rest.model.Course;
import fi.otavanopisto.pyramus.rest.model.CourseActivity;
import fi.otavanopisto.pyramus.rest.model.CourseActivityInfo;
import fi.otavanopisto.pyramus.rest.model.CourseAssessment;
import fi.otavanopisto.pyramus.rest.model.CourseAssessmentRequest;
import fi.otavanopisto.pyramus.rest.model.CourseModule;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMember;
import fi.otavanopisto.pyramus.rest.model.CourseStudent;
import fi.otavanopisto.pyramus.rest.model.CourseType;
import fi.otavanopisto.pyramus.rest.model.Curriculum;
import fi.otavanopisto.pyramus.rest.model.EducationType;
import fi.otavanopisto.pyramus.rest.model.EducationalTimeUnit;
import fi.otavanopisto.pyramus.rest.model.Email;
import fi.otavanopisto.pyramus.rest.model.Grade;
import fi.otavanopisto.pyramus.rest.model.GradingScale;
import fi.otavanopisto.pyramus.rest.model.MatriculationEligibilities;
import fi.otavanopisto.pyramus.rest.model.Organization;
import fi.otavanopisto.pyramus.rest.model.Person;
import fi.otavanopisto.pyramus.rest.model.StaffMember;
import fi.otavanopisto.pyramus.rest.model.Student;
import fi.otavanopisto.pyramus.rest.model.StudentCourseStats;
import fi.otavanopisto.pyramus.rest.model.StudentGroup;
import fi.otavanopisto.pyramus.rest.model.StudentGroupStudent;
import fi.otavanopisto.pyramus.rest.model.StudentGroupUser;
import fi.otavanopisto.pyramus.rest.model.StudentMatriculationEligibilityOPS2021;
import fi.otavanopisto.pyramus.rest.model.StudyProgramme;
import fi.otavanopisto.pyramus.rest.model.StudyProgrammeCategory;
import fi.otavanopisto.pyramus.rest.model.Subject;
import fi.otavanopisto.pyramus.rest.model.UserContact;
import fi.otavanopisto.pyramus.rest.model.UserCredentials;
import fi.otavanopisto.pyramus.rest.model.WhoAmI;
import fi.otavanopisto.pyramus.rest.model.composite.CompositeAssessmentRequest;
import fi.otavanopisto.pyramus.rest.model.composite.CompositeGrade;
import fi.otavanopisto.pyramus.rest.model.composite.CompositeGradingScale;
import fi.otavanopisto.pyramus.rest.model.course.CourseAssessmentPrice;
import fi.otavanopisto.pyramus.rest.model.course.CourseSignupStudentGroup;
import fi.otavanopisto.pyramus.rest.model.course.CourseSignupStudyProgramme;
import fi.otavanopisto.pyramus.rest.model.hops.StudyActivityItemRestModel;
import fi.otavanopisto.pyramus.rest.model.hops.StudyActivityRestModel;
import fi.otavanopisto.pyramus.rest.model.muikku.CredentialResetPayload;
import fi.otavanopisto.pyramus.rest.model.worklist.WorklistItemBilledPriceRestModel;
import fi.otavanopisto.pyramus.webhooks.WebhookCourseCreatePayload;
import fi.otavanopisto.pyramus.webhooks.WebhookCourseStaffMemberCreatePayload;
import fi.otavanopisto.pyramus.webhooks.WebhookCourseStudentCreatePayload;
import fi.otavanopisto.pyramus.webhooks.WebhookOrganizationCreatePayload;
import fi.otavanopisto.pyramus.webhooks.WebhookPersonCreatePayload;
import fi.otavanopisto.pyramus.webhooks.WebhookStaffMemberCreatePayload;
import fi.otavanopisto.pyramus.webhooks.WebhookStudentCreatePayload;
import fi.otavanopisto.pyramus.webhooks.WebhookStudentGroupCreatePayload;
import fi.otavanopisto.pyramus.webhooks.WebhookStudentGroupStaffMemberCreatePayload;
import fi.otavanopisto.pyramus.webhooks.WebhookStudentGroupStudentCreatePayload;
import fi.otavanopisto.pyramus.webhooks.WebhookStudyProgrammeCreatePayload;

public class PyramusMock {
  
  private static Logger logger = Logger.getLogger(PyramusMock.class.getName());
   
  private PyramusMock() {
      // Prevent direct use
  }

  public static Builder mocker() {
      return new PyramusMock.Builder();
  }

  public static class Builder {
      private PyramusMock pmock = new PyramusMock();

      public Builder() {
//        Some defaults for mocks
        pmock.objectMapper = new ObjectMapper().registerModule(new JavaTimeModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        
        GradingScale gs = new GradingScale(1l, "Pass/Fail", "Passed or failed scale", false);
        List<Grade> grades = new ArrayList<>();
        grades.add(new Grade(1l, "Excellent", "Excellent answer showing expertise in area of study", 1l, true, "0", null, false));
        grades.add(new Grade(2l, "Failed", "Failed answer. Not proving any expertise in the matter.", 1l, false, "1", null, false));
        pmock.gradingScales.put(gs, grades);
        
        gs = new GradingScale(2l, "4-10", "Lukion ja peruskoulun arviointiasteikko", false);
        grades = new ArrayList<>();
        grades.add(new Grade(3l, "4", "4", 2l, false, "4", null, false));
        grades.add(new Grade(4l, "5", "5", 2l, true, "5", null, false));
        grades.add(new Grade(5l, "6", "6", 2l, true, "6", null, false));
        grades.add(new Grade(6l, "7", "7", 2l, true, "7", null, false));
        grades.add(new Grade(7l, "8", "8", 2l, true, "8", null, false));
        grades.add(new Grade(8l, "9", "9", 2l, true, "9", null, false));
        grades.add(new Grade(9l, "10", "10", 2l, true, "10", null, false));
        pmock.gradingScales.put(gs, grades);
        
        pmock.educationalTimeUnits.add(new EducationalTimeUnit((long) 1, "test time unit", "h", (double) 1, false));
        pmock.educationTypes.add(new EducationType((long) 1, "testEduType", "ET", false));
        pmock.subjects.add(new Subject((long) 1, "tc_11", "Test course", (long) 1, false));
        
        pmock.studyProgrammeCategories.add(new StudyProgrammeCategory(1l, "All Study Programmes", 1l, false));
        pmock.studyProgrammes.add(new StudyProgramme(1l, 1l, "test", "Test Study Programme", 1l, null, false, false, null));
        
        pmock.courseTypes.add(new fi.otavanopisto.pyramus.rest.model.CourseType((long) 1, "Nonstop", false));
        pmock.courseTypes.add(new fi.otavanopisto.pyramus.rest.model.CourseType((long) 2, "Ryhmäkurssi", false));        
      }

      public Builder addStudyProgramme(StudyProgramme studyProgramme) {
        pmock.studyProgrammes.add(studyProgramme);
        return this;
      }
      
      public Builder addStudents(List<MockStudent> students) {
        for(MockStudent mockStudent : students) {
          Person person = new Person(mockStudent.getPersonId(), mockStudent.getBirthday(), mockStudent.getSocialSecurityNumber(), mockStudent.getSex(), false, "empty", mockStudent.getPersonId());
          pmock.persons.add(person);
        }
        pmock.students = students;
        return this;
      }

      public Builder addStudent(MockStudent mockStudent) {
        Person person = new Person(mockStudent.getPersonId(), mockStudent.getBirthday(), mockStudent.getSocialSecurityNumber(), mockStudent.getSex(), false, "empty", mockStudent.getPersonId());
        pmock.persons.add(person);
        pmock.students.add(mockStudent);
        return this;
      }

      public Builder updateStudent(MockStudent mockStudent) {
        Person person = new Person(mockStudent.getPersonId(), mockStudent.getBirthday(), mockStudent.getSocialSecurityNumber(), mockStudent.getSex(), false, "empty", mockStudent.getPersonId());
        if (!pmock.persons.isEmpty()) {
          Iterator<Person> persons = pmock.persons.iterator();
          while (persons.hasNext()) {
            Person person2 = (Person) persons.next();
            if(person2.getId().equals(person.getId())) {
              persons.remove();
            }
          }
        }
        if (!pmock.students.isEmpty()) {
          Iterator<MockStudent> mStudents = pmock.students.iterator();
          while (mStudents.hasNext()) {
            MockStudent mockStudent2 = (MockStudent) mStudents.next();
            if(mockStudent2.getId().equals(mockStudent.getId())) {
              mStudents.remove();
            }
          }
        }
        pmock.persons.add(person);
        pmock.students.add(mockStudent);
        return this;
      }
      
      public Builder addCourseStaffMembers(HashMap<Long, List<CourseStaffMember>> courseStaffMembers){
        pmock.courseStaffMembers = courseStaffMembers;
        return this;
      }
      
      public Builder addCourseStaffMember(Long courseId, CourseStaffMember courseStaffMember){
        if(pmock.courseStaffMembers.containsKey(courseId)){
          pmock.courseStaffMembers.get(courseId).add(courseStaffMember);
        }else{
          List<CourseStaffMember> courseStaffList = new ArrayList<>();
          courseStaffList.add(courseStaffMember);
          pmock.courseStaffMembers.put(courseId, courseStaffList);
        }
        return this;
      }
      
      public Builder addStaffMembers(List<MockStaffMember> staffMembers) {
        OffsetDateTime birthday = OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC);
        for(MockStaffMember mockStaffMember : staffMembers) {
          Person person = new Person(mockStaffMember.getPersonId(), birthday, mockStaffMember.getSocialSecurityNumber(), mockStaffMember.getSex(), false, "empty", mockStaffMember.getPersonId());
          pmock.persons.add(person);
        }
        pmock.staffMembers = staffMembers;
        return this;
      }
      
      public Builder addStaffMember(MockStaffMember mockStaffMember) {
        OffsetDateTime birthday = OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC);
        Person person = new Person(mockStaffMember.getPersonId(), birthday, mockStaffMember.getSocialSecurityNumber(), mockStaffMember.getSex(), false, "empty", mockStaffMember.getPersonId());
        pmock.persons.add(person);
        pmock.staffMembers.add(mockStaffMember);
        return this;
      }

      public Builder addCourseStudent(Long courseId, MockCourseStudent mockCourseStudent){        
        Iterator<MockCourseStudent> mcsIter = pmock.mockCourseStudents.iterator();
        while (mcsIter.hasNext()) {
          MockCourseStudent mcs = mcsIter.next();
          if (mcs.getId() == mockCourseStudent.getId() && mcs.getCourse().getId() == mockCourseStudent.getCourse().getId()) {
            mcsIter.remove();
          }
        }
        pmock.mockCourseStudents.add(mockCourseStudent);

        CourseStudent courseStudent = TestUtilities.courseStudentFromMockCourseStudent(mockCourseStudent);
        Set<Long> courseIds = pmock.courseStudents.keySet();
        for (Long cid : courseIds) {
          Iterator<CourseStudent> csIter = pmock.courseStudents.get(cid).iterator();
          while (csIter.hasNext()) {
            CourseStudent cs = csIter.next();
//            CourseId should always match here obv.
            if (courseStudent.getId() == cs.getId() && courseStudent.getCourseId() == cs.getCourseId()) {
              csIter.remove();
            }
          }
        }
        
        if(pmock.courseStudents.containsKey(courseId)){
          pmock.courseStudents.get(courseId).add(courseStudent);
        }else{
          List<CourseStudent> csList = new ArrayList<>();
          csList.add(courseStudent);
          pmock.courseStudents.put(courseId, csList);
        }
        
        return this;
      }
      
//      TODO: UserGroup mockings
      public Builder addStudentGroup(Long id, Long organizationId, String name, String description, Long creatorId, boolean archived, boolean isGuidanceGroup) {
        OffsetDateTime date = OffsetDateTime.of(2015, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC);
        List<String> tags = new ArrayList<>();
        pmock.studentGroups.add(new StudentGroup(id, name, description, date, creatorId, date, creatorId, date, tags, isGuidanceGroup, organizationId, archived));
        return this;
      }
      
      public Builder addStudentToStudentGroup(Long userGroupId, MockStudent student) {
        StudentGroupStudent studentGroupStudent = new StudentGroupStudent(student.getId(), student.getId());
          if(pmock.studentGroupUsers.containsKey(userGroupId)){
            pmock.studentGroupUsers.get(userGroupId).add(studentGroupStudent);
          }else{
            List<Object> sgsList = new ArrayList<>();
            sgsList.add(studentGroupStudent);
            pmock.studentGroupUsers.put(userGroupId, sgsList);
          }
        return this;
      }
      
      public Builder addStaffMemberToStudentGroup(Long userGroupId, MockStaffMember staffMember) {
        StudentGroupUser studentGroupUser = new StudentGroupUser(staffMember.getId(), staffMember.getId(), false, false, false);
          if(pmock.studentGroupUsers.containsKey(userGroupId)){
            pmock.studentGroupUsers.get(userGroupId).add(studentGroupUser);
          }else{
            List<Object> sgsList = new ArrayList<>();
            sgsList.add(studentGroupUser);
            pmock.studentGroupUsers.put(userGroupId, sgsList);
          }
        return this;
      }
      
      public Builder addSignupStudyProgramme(CourseSignupStudyProgramme signupStudyProgramme) {
        Long courseId = signupStudyProgramme.getCourseId();
        if (pmock.signupStudyProgrammes.containsKey(courseId)) {
          pmock.signupStudyProgrammes.get(courseId).add(signupStudyProgramme);
        } else {
          List<CourseSignupStudyProgramme> newList = new ArrayList<>();
          newList.add(signupStudyProgramme);
          pmock.signupStudyProgrammes.put(courseId, newList);
        }
        return this;
      }
      
      public Builder addSignupStudentGroup(CourseSignupStudentGroup signupStudentGroup) {
        Long courseId = signupStudentGroup.getCourseId();
        if (pmock.signupStudentGroups.containsKey(courseId)) {
          pmock.signupStudentGroups.get(courseId).add(signupStudentGroup);
        } else {
          List<CourseSignupStudentGroup> newList = new ArrayList<>();
          newList.add(signupStudentGroup);
          pmock.signupStudentGroups.put(courseId, newList);
        }
        return this;
      }

      public Builder mockStudentGroups() throws Exception {
        List<String> payloads = new ArrayList<>();
        stubFor(get(urlMatching(String.format("/1/students/studentGroups")))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(pmock.studentGroups))
              .withStatus(200)));
        for(StudentGroup sg : pmock.studentGroups) {
          stubFor(get(urlMatching(String.format("/1/students/studentGroups/%d", sg.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(sg))
              .withStatus(200)));
          pmock.payloads.add(pmock.objectMapper.writeValueAsString(new WebhookStudentGroupCreatePayload(sg.getId())));
          payloads.add(pmock.objectMapper.writeValueAsString(new WebhookStudentGroupCreatePayload(sg.getId())));
        }
        
        for (Long groupId : pmock.studentGroupUsers.keySet()) {
          List<StudentGroupStudent> students = new ArrayList<>();
          List<StudentGroupUser> users = new ArrayList<>();
          for (Object o : pmock.studentGroupUsers.get(groupId)) {
            if(o instanceof StudentGroupStudent){            
            StudentGroupStudent sgStudent = (StudentGroupStudent) o;
            students.add(sgStudent);
              stubFor(get(urlMatching(String.format("/1/students/studentGroups/%d/students/%d", groupId, sgStudent.getStudentId())))
              .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pmock.objectMapper.writeValueAsString(sgStudent))
                .withStatus(200)));
            pmock.payloads.add(pmock.objectMapper.writeValueAsString(new WebhookStudentGroupStudentCreatePayload(sgStudent.getId(), groupId, sgStudent.getStudentId())));
            payloads.add(pmock.objectMapper.writeValueAsString(new WebhookStudentGroupStudentCreatePayload(sgStudent.getId(), groupId, sgStudent.getStudentId())));
            }else if(o instanceof StudentGroupUser){
              StudentGroupUser sgUser = (StudentGroupUser) o;
              users.add(sgUser);
                stubFor(get(urlMatching(String.format("/1/students/studentGroups/%d/staffmembers/%d", groupId, sgUser.getStaffMemberId())))
                .willReturn(aResponse()
                  .withHeader("Content-Type", "application/json")
                  .withBody(pmock.objectMapper.writeValueAsString(sgUser))
                  .withStatus(200)));
              pmock.payloads.add(pmock.objectMapper.writeValueAsString(new WebhookStudentGroupStaffMemberCreatePayload(sgUser.getId(), groupId, sgUser.getStaffMemberId())));
              payloads.add(pmock.objectMapper.writeValueAsString(new WebhookStudentGroupStaffMemberCreatePayload(sgUser.getId(), groupId, sgUser.getStaffMemberId())));
            }
          }
//        students
          stubFor(get(urlMatching(String.format("/1/students/studentGroups/%d/students", groupId)))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(students))
            .withStatus(200)));
//        users
          stubFor(get(urlMatching(String.format("/1/students/studentGroups/%d/staffmembers", groupId)))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(users))
            .withStatus(200)));            
        }
        
        for (String payload : payloads) {
          TestUtilities.webhookCall("http://dev.muikku.fi:" + System.getProperty("it.port.http") + "/pyramus/webhook", payload);
        }
        
        return this;
      }
      
      public Builder addCourseType(CourseType courseType) throws JsonProcessingException {
        pmock.courseTypes.add(courseType);
        return this;
      }
      
      public Builder mockCourseStudents() throws Exception {
        List<String> payloads = new ArrayList<>();
        Set<Long> courseIds = pmock.courseStudents.keySet();
        for (Long courseId : courseIds) {
          logger.log(Level.FINE, String.format("Mocking students for course %d", courseId));
          List<CourseStudent> courseStudents = pmock.courseStudents.get(courseId);
          for (CourseStudent cs : courseStudents) {
            logger.log(Level.FINE, String.format("Mocking course student %d for course %d", cs.getId(), courseId));
            
            stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/students/%d", cs.getCourseId(), cs.getId())))
              .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pmock.objectMapper.writeValueAsString(cs))
                .withStatus(200)));            
            
            CourseStudent[] courseStudentArray = {cs};
            
            stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/students?studentId=%d", cs.getCourseId(), cs.getStudentId())))
              .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pmock.objectMapper.writeValueAsString(courseStudentArray))
                .withStatus(200)));
            
            pmock.payloads.add(pmock.objectMapper.writeValueAsString(new WebhookCourseStudentCreatePayload(cs.getId(), 
              cs.getCourseId(), cs.getStudentId())));
            payloads.add(pmock.objectMapper.writeValueAsString(new WebhookCourseStudentCreatePayload(cs.getId(), 
                cs.getCourseId(), cs.getStudentId())));
          }
        
//          stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/students", courseId))).withQueryParam("activeStudents", containing("true"))
          stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/students?activeStudents=true", courseId)))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(pmock.courseStudents.get(courseId)))
              .withStatus(200)));
          
          stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/students", courseId)))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(pmock.courseStudents.get(courseId)))
              .withStatus(200)));
        }
        for (String payload : payloads) {
          TestUtilities.webhookCall("http://dev.muikku.fi:" + System.getProperty("it.port.http") + "/pyramus/webhook", payload);
        }
        return this;
      }
          
      public Builder mockCourseStaffMembers() throws Exception {
        List<String> payloads = new ArrayList<>();
        Set<Long> courseIds = pmock.courseStaffMembers.keySet(); 
        for (Long courseId : courseIds) {
          List<CourseStaffMember> courseStaffMembers = pmock.courseStaffMembers.get(courseId);
          for (CourseStaffMember cs : courseStaffMembers) {
            stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/staffMembers/%d", cs.getCourseId(), cs.getId())))
              .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pmock.objectMapper.writeValueAsString(cs))
                .withStatus(200)));
            payloads.add(pmock.objectMapper.writeValueAsString(new WebhookCourseStaffMemberCreatePayload(cs.getId(), 
                cs.getCourseId(), cs.getStaffMemberId())));
            pmock.payloads.add(pmock.objectMapper.writeValueAsString(new WebhookCourseStaffMemberCreatePayload(cs.getId(), 
              cs.getCourseId(), cs.getStaffMemberId())));
          }
          stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/staffMembers", courseId)))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(pmock.courseStaffMembers.get(courseId)))
              .withStatus(200)));
        }
        for (String payload : payloads) {
          TestUtilities.webhookCall("http://dev.muikku.fi:" + System.getProperty("it.port.http") + "/pyramus/webhook", payload);
        }
        return this;
      }
      
      public Builder mockCourseEducationTypes() throws JsonProcessingException {
        
        stubFor(get(urlMatching("/1/courses/\\d+/educationTypes"))
          .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody("[]")
              .withStatus(200)));

        
        stubFor(get(urlMatching("/1/courses/\\d+/educationTypes/\\d+/subtypes"))
          .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody("[]")
              .withStatus(200)));
        
        return this;
      }
      
      public Builder mockCourseTypes() throws JsonProcessingException {
        stubFor(get(urlEqualTo("/1/courses/courseTypes/"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(pmock.courseTypes))
            .withStatus(200)));
        
        stubFor(get(urlEqualTo("/1/courses/courseTypes"))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(pmock.courseTypes))
              .withStatus(200)));
        
        for (CourseType courseType : pmock.courseTypes) {
          stubFor(get(urlEqualTo(String.format("/1/courses/courseTypes/%d", courseType.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(courseType))
              .withStatus(200)));          
        }
        return this;
      }
      
      public Builder addSubject(Subject subject) {
        pmock.subjects.add(subject);
        return this;
      }
      
      public Builder mockSubjects() throws JsonProcessingException {
        for (Subject subject : pmock.subjects) {
          stubFor(get(urlEqualTo(String.format("/1/common/subjects/%d", subject.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(subject))
              .withStatus(200)));
          
          stubFor(get(urlEqualTo(String.format("/1/common/subjectByCode/%s", subject.getCode())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(subject))
              .withStatus(200)));
        }
        stubFor(get(urlEqualTo("/1/common/subjects"))
                .willReturn(aResponse()
                  .withHeader("Content-Type", "application/json")
                  .withBody(pmock.objectMapper.writeValueAsString(pmock.subjects))
                  .withStatus(200)));

//      Following is a hack I'm not terribly proud of, but it silences records view errors for now.
//      Could mock subjects like in prod. but waiting for dynamically working system to this.
        List<String> codes = new ArrayList<>();
        codes.addAll(Arrays.asList("%C3%A4i", "s2", "rub", "ena", "ma", "ue", "et", "hi", "yh", "fy", "ke", "bi", "ge", "te", "ot"));
        for (String code : codes) { 
            Subject subject = pmock.getSubjects().get(0);
            stubFor(get(urlEqualTo(String.format("/1/common/subjectByCode/%s", code)))
              .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pmock.objectMapper.writeValueAsString(subject))
                .withStatus(200)));            
        }

        return this;
      }
      
      public Builder mockCurriculums() throws JsonProcessingException {
        Curriculum ops21 = new Curriculum(1L,"OPS 2021", false);
        Curriculum ops16 = new Curriculum(2L,"OPS 2016", false);
        Curriculum ops18 = new Curriculum(3L,"OPS 2018", false);
        Curriculum ops05 = new Curriculum(4L,"OPS 2005", false);
        List<Curriculum> curriculums = new ArrayList<Curriculum>();
        curriculums.add(ops05);
        curriculums.add(ops16);
        curriculums.add(ops18);
        curriculums.add(ops21);
        stubFor(get(urlPathEqualTo("/1/common/curriculums"))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(curriculums))
              .withStatus(200)));
        return this;        
      }
      
      public Builder addEducationType(EducationType eduType) {
        pmock.educationTypes.add(eduType);
        return this;
        
      }
      
      public Builder mockEducationTypes() throws JsonProcessingException {
        for (EducationType educationType : pmock.educationTypes) {
          stubFor(get(urlEqualTo(String.format("/1/common/educationTypes/%d", educationType.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(educationType))
              .withStatus(200)));          
        }

        stubFor(get(urlEqualTo("/1/common/educationTypes"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(pmock.educationTypes))
            .withStatus(200)));
        return this;
      }
      
      public Builder mockEducationalTimeUnits() throws JsonProcessingException {
        for (EducationalTimeUnit educationalTimeUnit : pmock.educationalTimeUnits) {
          stubFor(get(urlEqualTo("/1/common/educationalTimeUnits/1"))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(educationalTimeUnit))
              .withStatus(200)));
        }
        stubFor(get(urlEqualTo("/1/common/educationalTimeUnits"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(pmock.educationalTimeUnits))
            .withStatus(200)));
        return this;
      }
      
      public Builder addGradingScaleWithGrades(GradingScale gradingScale, List<Grade> grades) {
        pmock.gradingScales.put(gradingScale, grades);
        return this;
      }
      
      @SuppressWarnings({ "unchecked", "rawtypes" })
      public Builder mockGradesAndScales() throws JsonProcessingException {
        GradingScale gradingScale;
        Iterator it = pmock.gradingScales.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry gsPair = (Map.Entry)it.next();
            gradingScale = (GradingScale) gsPair.getKey();
            
            stubFor(get(urlEqualTo(String.format("/1/common/gradingScales/%d", gradingScale.getId())))
              .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pmock.objectMapper.writeValueAsString(gradingScale))
                .withStatus(200)));
            
            List<Grade> grades = (List<Grade>) gsPair.getValue();
            for (Grade grade : grades) {
              stubFor(get(urlEqualTo(String.format("/1/common/gradingScales/%d/grades/%d", gradingScale.getId(), grade.getId())))
                .willReturn(aResponse()
                  .withHeader("Content-Type", "application/json")
                  .withBody(pmock.objectMapper.writeValueAsString(grade))
                  .withStatus(200)));
            }
            stubFor(get(urlEqualTo(String.format("/1/common/gradingScales/%d/grades", gradingScale.getId())))
              .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pmock.objectMapper.writeValueAsString(grades))
                .withStatus(200)));

        }
        
        stubFor(get(urlEqualTo("/1/common/gradingScales"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(pmock.gradingScales.keySet()))
            .withStatus(200)));

        stubFor(get(urlEqualTo(String.format("/1/common/gradingScales/?filterArchived=true")))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(pmock.gradingScales.keySet()))
            .withStatus(200)));
        
        return this;
      }
    
      public Builder mockStudents() throws Exception{
        List<String> payloads = new ArrayList<>();
        List<Student> studentsList = new ArrayList<>();
        for (MockStudent mockStudent : pmock.students) {
          Student student = TestUtilities.studentFromMockStudent(mockStudent);

          stubFor(get(urlEqualTo(String.format("/1/students/students/%d", student.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(student))
              .withStatus(200)));

          Email email = new Email(student.getId(), true, mockStudent.getEmail());
          Email[] emails = { email };
          
          stubFor(get(urlEqualTo(String.format("/1/users/users/%d/defaultEmailAddress", student.getId())))
              .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pmock.objectMapper.writeValueAsString(email))
                .withStatus(200)));
          
          stubFor(get(urlEqualTo(String.format("/1/students/students/%d/emails", student.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(emails))
              .withStatus(200)));
          
          Student[] studentArray = { student };
          
          stubFor(get(urlEqualTo(String.format("/1/students/students?email=%s", mockStudent.getEmail())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(studentArray))
              .withStatus(200)));
          
          if (!mockStudent.getCounselors().isEmpty()) {
            stubFor(get(urlPathEqualTo(String.format("/1/students/students/%d/guidanceCounselors", mockStudent.getId())))
                .withQueryParam("onlyMessageRecipients", matching(".*"))
              .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pmock.objectMapper.writeValueAsString(mockStudent.getCounselors()))
                .withStatus(200)));
          }
          
          stubFor(get(urlMatching(String.format("/1/persons/persons/%d/students", student.getPersonId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(studentArray))
              .withStatus(200)));

          stubFor(get(urlMatching(String.format("/1/students/students/%d/studyPeriods", student.getId())))
            .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pmock.objectMapper.writeValueAsString(mockStudent.getStudyPeriods()))
                .withStatus(200)));
          
          stubFor(get(urlMatching(String.format("/1/students/students/%d/subjectChoices", student.getId())))
              .willReturn(aResponse()
                  .withHeader("Content-Type", "application/json")
                  .withBody(pmock.objectMapper.writeValueAsString(new ArrayList<>()))
                  .withStatus(200)));
          
          studentsList.add(student);
          pmock.payloads.add(pmock.objectMapper.writeValueAsString(new WebhookStudentCreatePayload(student.getId())));
          payloads.add(pmock.objectMapper.writeValueAsString(new WebhookStudentCreatePayload(student.getId())));
        }
        
        stubFor(get(urlPathEqualTo("/1/students/students"))
            .withQueryParam("filterArchived", equalTo("false"))
            .withQueryParam("firstResult", matching(".*"))
            .withQueryParam("maxResults", matching(".*"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(studentsList))
            .withStatus(200)));

        stubFor(get(urlEqualTo("/1/students/students"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(studentsList))
            .withStatus(200)));
        
        for (String payload : payloads) {
          TestUtilities.webhookCall("http://dev.muikku.fi:" + System.getProperty("it.port.http") + "/pyramus/webhook", payload);
        }
        
        return this;
      }
      
      public Builder mockIAmCounselor() throws Exception {
        stubFor(get(urlMatching(String.format("/1/students/students/.*/amICounselor")))
            .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pmock.objectMapper.writeValueAsString(true))
                .withStatus(200)));
        return this;
      }
      
      public Builder mockPersons() throws Exception {
        List<String> payloads = new ArrayList<>();
        for (Person person : pmock.persons) {
          stubFor(get(urlEqualTo("/1/persons/persons/" + person.getId()))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(person))
              .withStatus(200)));
          
          UserCredentials userCredentials = new UserCredentials(null, "test", null);
          
          stubFor(get(urlEqualTo(String.format("/1/persons/persons/%d/credentials", person.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(userCredentials))
              .withStatus(200)));
          pmock.payloads.add(pmock.objectMapper.writeValueAsString(new WebhookPersonCreatePayload(person.getId())));          
          payloads.add(pmock.objectMapper.writeValueAsString(new WebhookPersonCreatePayload(person.getId())));
        }
        
        stubFor(get(urlPathEqualTo("/1/persons/persons"))
            .withQueryParam("filterArchived", matching(".*"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(pmock.persons))
            .withStatus(200)));

        stubFor(get(urlEqualTo("/1/persons/persons"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(pmock.persons))
            .withStatus(200)));
        
        for (String payload : payloads) {
          TestUtilities.webhookCall("http://dev.muikku.fi:" + System.getProperty("it.port.http") + "/pyramus/webhook", payload);
        }
        return this;
      }
      
      public Builder mockStudyProgrammes() throws Exception {       
        List<String> payloads = new ArrayList<>();
        stubFor(get(urlEqualTo("/1/students/studyProgrammes"))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(pmock.studyProgrammes))
              .withStatus(200)));
        
        for (StudyProgramme sp : pmock.studyProgrammes) {
          stubFor(get(urlEqualTo(String.format("/1/students/studyProgrammes/%d", sp.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(sp))
              .withStatus(200)));
          pmock.payloads.add(pmock.objectMapper.writeValueAsString(new WebhookStudyProgrammeCreatePayload(sp.getId())));
          payloads.add(pmock.objectMapper.writeValueAsString(new WebhookStudyProgrammeCreatePayload(sp.getId())));
        }

        stubFor(get(urlEqualTo("/1/students/studyProgrammeCategories"))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(pmock.studyProgrammeCategories))
              .withStatus(200)));
        
        for (StudyProgrammeCategory spc : pmock.studyProgrammeCategories) {
          stubFor(get(urlEqualTo(String.format("/1/students/studyProgrammeCategories/%d", spc.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(spc))
              .withStatus(200)));
        }
        
        for (String payload : payloads) {
          TestUtilities.webhookCall("http://dev.muikku.fi:" + System.getProperty("it.port.http") + "/pyramus/webhook", payload);
        }
        
        return this;
      }
      
      public Builder mockContactTypes() throws JsonProcessingException {      
        ContactType contactType = new ContactType((long)1, "Koti", false, false);
        ContactType[] contactTypes = { contactType };

        stubFor(get(urlMatching("/1/common/contactTypes/.*"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(contactType))
            .withStatus(200)));
        
        stubFor(get(urlEqualTo("/1/common/contactTypes"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(contactTypes))
            .withStatus(200)));
        return this;
      }
      
      public Builder mockStaffMembers() throws Exception {
        List<String> payloads = new ArrayList<>();
        Map<String, String> variables = new HashMap<String, String>();
        List<String> tags = new ArrayList<>();
        List<StaffMember> staffs = new ArrayList<>();
        for (MockStaffMember mockStaffMember : pmock.staffMembers) {
          StaffMember staffMember = new StaffMember(mockStaffMember.getId(), mockStaffMember.getPersonId(), mockStaffMember.getOrganizationId(), null, mockStaffMember.getFirstName(), mockStaffMember.getLastName(), null, EnumSet.of(mockStaffMember.getRole()), tags, variables, mockStaffMember.getStaffStudyProgrammes());

          stubFor(get(urlEqualTo(String.format("/1/staff/members/%d", staffMember.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(staffMember))
              .withStatus(200)));
          
          StaffMember[] staffMemberArray = { staffMember };
          
          stubFor(get(urlEqualTo(String.format("/1/staff/members?email=%s", mockStaffMember.getEmail())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(staffMemberArray))
              .withStatus(200)));
          
          Email email = new Email(staffMember.getId(), true, mockStaffMember.getEmail());
          Email[] emails = { email };

          stubFor(get(urlEqualTo(String.format("/1/users/users/%d/defaultEmailAddress", staffMember.getId())))
              .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pmock.objectMapper.writeValueAsString(email))
                .withStatus(200)));

          
          stubFor(get(urlEqualTo(String.format("/1/staff/members/%d/emails", staffMember.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(emails))
              .withStatus(200)));
          
          stubFor(get(urlMatching(String.format("/1/persons/persons/%d/staffMembers", staffMember.getPersonId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(staffMemberArray))
              .withStatus(200)));
          
          staffs.add(staffMember);
          payloads.add(pmock.objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload(staffMember.getId())));
          pmock.payloads.add(pmock.objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload(staffMember.getId())));
        }
        
        stubFor(get(urlEqualTo("/1/staff/members"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(staffs))
            .withStatus(200)));
        for (String payload : payloads) {
          TestUtilities.webhookCall("http://dev.muikku.fi:" + System.getProperty("it.port.http") + "/pyramus/webhook", payload);
        }
        return this;
      }
      
      public Builder mockAssessmentRequests(Long studentId, Long courseId, Long courseStudentId, String requestText, boolean archived, boolean handled, OffsetDateTime date) throws JsonProcessingException {
        List<CourseAssessmentRequest> assessmentRequests = new ArrayList<CourseAssessmentRequest>();
        
        if (courseStudentId != null && requestText != null) {
          CourseAssessmentRequest assessmentRequest = new CourseAssessmentRequest(Long.parseLong(courseId + "" + studentId), courseStudentId, date, requestText, archived, handled);
          assessmentRequests.add(assessmentRequest);
          
          stubFor(get(urlEqualTo(String.format("/1/students/students/%d/courses/%d/assessmentRequests/%d", studentId, courseId, assessmentRequest.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(assessmentRequest))
              .withStatus(200)));
          
          stubFor(post(urlEqualTo(String.format("/1/students/students/%d/courses/%d/assessmentRequests/", studentId, courseId)))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(assessmentRequest))
              .withStatus(200)));
        }

        
        stubFor(get(urlEqualTo(String.format("/1/students/students/%d/courses/%d/assessmentRequests/", studentId, courseId)))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(assessmentRequests))
            .withStatus(200)));

        stubFor(get(urlPathEqualTo(String.format("/1/students/students/%d/courses/%d/assessmentRequests/", studentId, courseId)))
            .withQueryParam("archived", matching("false"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(assessmentRequests))
            .withStatus(200)));
        
        stubFor(get(urlEqualTo(String.format("/1/students/%d/assessmentRequests/", studentId)))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(assessmentRequests))
              .withStatus(200)));
       
        return this;
      }

      public Builder mockAssessmentRequestLocking(Long studentId, Long courseId, Long courseStudentId, String requestText, boolean archived, boolean handled, OffsetDateTime date) throws JsonProcessingException {
        CourseAssessmentRequest assessmentRequest = new CourseAssessmentRequest(Long.parseLong(courseId + "" + studentId), courseStudentId, date, requestText, archived, handled);
        stubFor(put(urlEqualTo(String.format("/1/courses/courses/%d/courseStudents/%d/assessmentRequest/lock", courseId, courseStudentId)))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(assessmentRequest))
            .withStatus(200)));
        
        return this;
      }
      
      @SuppressWarnings({ "unchecked", "rawtypes" })
      public Builder mockCompositeGradingScales() throws JsonProcessingException {
        List<CompositeGradingScale> compositeGradingScales = new ArrayList<CompositeGradingScale>();

        GradingScale gradingScale;

        Iterator it = pmock.gradingScales.entrySet().iterator();
        while (it.hasNext()) {
          Map.Entry gsPair = (Map.Entry)it.next();
          gradingScale = (GradingScale) gsPair.getKey();
          List<CompositeGrade> compositeGrades = new ArrayList<CompositeGrade>();

          List<Grade> grades = (List<Grade>) gsPair.getValue();

          for (Grade grade : grades) {
            compositeGrades.add(new CompositeGrade(grade.getId(), grade.getName()));          
          }
          compositeGradingScales.add(new CompositeGradingScale(
            gradingScale.getId(),
            gradingScale.getName(),
            compositeGrades)
          );
        }
        
        stubFor(get(urlEqualTo("/1/composite/gradingScales/"))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(compositeGradingScales))
              .withStatus(200)));
              
        return this;
      }
      
      public Builder addCompositeCourseAssessmentRequest(Long studentId, Long courseId, Long courseStudentId, String requestText, boolean archived, boolean handled, Course course, MockStudent courseStudent, OffsetDateTime date, boolean passing) {
        OffsetDateTime enrollmemnt = OffsetDateTime.of(2010, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC);
        CourseAssessmentRequest courseAssessmentRequest = new CourseAssessmentRequest(Long.parseLong(courseId + "" + studentId), courseStudentId, date, requestText, archived, handled);

        CompositeAssessmentRequest assessmentRequest = new CompositeAssessmentRequest();
        assessmentRequest.setId(Long.parseLong(courseId + "" + studentId));
        assessmentRequest.setCourseStudentId(courseStudentId);
        assessmentRequest.setAssessmentRequestDate(Date.from(courseAssessmentRequest.getCreated().toInstant()));
        assessmentRequest.setCourseEnrollmentDate(Date.from(enrollmemnt.toInstant()));
        if(handled) {
          assessmentRequest.setEvaluationDate(Date.from(date.toInstant()));          
        }else {
          assessmentRequest.setEvaluationDate(null);
        }
        assessmentRequest.setCourseId(courseId);
        assessmentRequest.setCourseName(course.getName());
        assessmentRequest.setCourseNameExtension(course.getNameExtension());
        assessmentRequest.setFirstName(courseStudent.getFirstName());
        assessmentRequest.setLastName(courseStudent.getLastName());
        assessmentRequest.setStudyProgramme("Test Study Programme");
        assessmentRequest.setUserId(studentId);
        assessmentRequest.setPassing(passing);
        
        List<CompositeAssessmentRequest> existingRequests = pmock.compositeCourseAssessmentRequests.get(courseId);
        List<CompositeAssessmentRequest> toRemove = new ArrayList<>();
        if(existingRequests != null) {
          for (CompositeAssessmentRequest compositeAssessmentRequest : existingRequests) {
            Long cStudentId = compositeAssessmentRequest.getCourseStudentId();
            if(cStudentId.equals(courseStudentId)) {
              toRemove.add(compositeAssessmentRequest);
            }
          }
          if(!toRemove.isEmpty()) {
            for (CompositeAssessmentRequest compositeAssessmentRequest : toRemove) {
              pmock.compositeCourseAssessmentRequests.get(courseId).remove(compositeAssessmentRequest);
            }            
          }
          pmock.compositeCourseAssessmentRequests.get(courseId).add(assessmentRequest);
        }else {
          ArrayList<CompositeAssessmentRequest> assessmentRequests = new ArrayList<>();
          assessmentRequests.add(assessmentRequest);
          pmock.compositeCourseAssessmentRequests.put(courseId, assessmentRequests);          
        }
        
        return this;
      }
      
      public Builder mockCompositeCourseAssessmentRequests() throws JsonProcessingException {        
        for (Long courseId : pmock.compositeCourseAssessmentRequests.keySet()) {
          stubFor(get(urlPathEqualTo(String.format("/1/composite/course/%d/assessmentRequests", courseId)))
            .withQueryParam("courseStudentIds", matching(".*"))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(pmock.compositeCourseAssessmentRequests.get(courseId)))
              .withStatus(200)));
        }
        return this;
      }
      
      public Builder addStaffCompositeAssessmentRequest(Long studentId, Long courseId, Long courseStudentId, String requestText, boolean archived, boolean handled,
          Course course, MockStudent courseStudent, Long staffMemberId, OffsetDateTime date, boolean passing) {
        OffsetDateTime enrollmemnt = OffsetDateTime.of(2010, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC);
        CourseAssessmentRequest courseAssessmentRequest = new CourseAssessmentRequest(Long.parseLong(courseId + "" + studentId), courseStudentId, date, requestText, archived, handled);
        CompositeAssessmentRequest assessmentRequest = new CompositeAssessmentRequest();
        assessmentRequest.setId(Long.parseLong(courseId + "" + studentId));
        assessmentRequest.setCourseStudentId(courseStudentId);
        assessmentRequest.setAssessmentRequestDate(Date.from(courseAssessmentRequest.getCreated().toInstant()));
        assessmentRequest.setCourseEnrollmentDate(Date.from(enrollmemnt.toInstant()));
        if(handled) {
          assessmentRequest.setEvaluationDate(Date.from(date.toInstant()));          
        }else {
          assessmentRequest.setEvaluationDate(null);
        }
        assessmentRequest.setPassing(passing);
        assessmentRequest.setCourseId(courseId);
        assessmentRequest.setCourseName(course.getName());
        assessmentRequest.setCourseNameExtension(course.getNameExtension());
        assessmentRequest.setFirstName(courseStudent.getFirstName());
        assessmentRequest.setLastName(courseStudent.getLastName());
        assessmentRequest.setStudyProgramme("Test Study Programme");
        assessmentRequest.setUserId(studentId);
        List<CompositeAssessmentRequest> existingRequests = pmock.compositeStaffAssessmentRequests.get(staffMemberId);
        List<CompositeAssessmentRequest> toRemove = new ArrayList<>();
        if(existingRequests != null) {
          for (CompositeAssessmentRequest compositeAssessmentRequest : existingRequests) {
            Long cStudentId = compositeAssessmentRequest.getCourseStudentId();
            if(cStudentId.equals(courseStudentId)) {
              toRemove.add(compositeAssessmentRequest);
            }
          }
          if(!toRemove.isEmpty()) {
            for (CompositeAssessmentRequest compositeAssessmentRequest : toRemove) {
              pmock.compositeStaffAssessmentRequests.get(staffMemberId).remove(compositeAssessmentRequest);
            }            
          }
          pmock.compositeStaffAssessmentRequests.get(staffMemberId).add(assessmentRequest);
        }else {
          ArrayList<CompositeAssessmentRequest> assessmentRequests = new ArrayList<>();
          assessmentRequests.add(assessmentRequest);
          pmock.compositeStaffAssessmentRequests.put(staffMemberId, assessmentRequests);          
        }

        return this;
      }
      
      public Builder mockStaffCompositeCourseAssessmentRequests() throws JsonProcessingException {
        for (Long staffMemberId : pmock.compositeStaffAssessmentRequests.keySet()) {
          stubFor(get(urlEqualTo(String.format("/1/composite/staffMembers/%d/assessmentRequests/", staffMemberId)))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(pmock.compositeStaffAssessmentRequests.get(staffMemberId)))
              .withStatus(200)));
        }
        return this;
      }
      
      public Builder mockCourseAssessments(Course course, MockCourseStudent courseStudent, MockStaffMember staffMember) throws JsonProcessingException {
        OffsetDateTime assessmentCreated = OffsetDateTime.of(LocalDateTime.now(), ZoneOffset.UTC);
        // This uses always only the first course module of the course that the iterator provides - this may need multi-module support later
        CourseModule courseModule = course.getCourseModules().iterator().next();
        CourseAssessment courseAssessment = new CourseAssessment(Long.parseLong(course.getId() + "" + courseStudent.getStudentId()), courseStudent.getId(), courseModule.getId(), 1l, 1l, staffMember.getId(), assessmentCreated, "Test evaluation.", Boolean.TRUE);
        
        stubFor(post(urlMatching(String.format("/1/students/students/%d/courses/%d/assessments/", courseStudent.getStudentId(), courseStudent.getCourse().getId())))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(courseAssessment))
            .withStatus(200)));

        List<CourseAssessment> courseAssessments = new ArrayList<CourseAssessment>();
        courseAssessments.add(courseAssessment);
        stubFor(get(urlEqualTo(String.format("/1/students/students/%d/courses/%d/assessments/", courseStudent.getStudentId(), courseStudent.getCourse().getId())))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(courseAssessments))
            .withStatus(200)));
        
        stubFor(get(urlEqualTo(String.format("/1/students/students/%d/courses/%d/assessments/%d", courseStudent.getStudentId(), courseStudent.getCourse().getId(), courseAssessment.getId())))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(courseAssessment))
            .withStatus(200)));

        stubFor(put(urlEqualTo(String.format("/1/students/students/%d/courses/%d/assessments/%d", courseStudent.getStudentId(), courseStudent.getCourse().getId(), courseAssessment.getId())))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(courseAssessment))
            .withStatus(200)));
        
        return this;
      }
      
      public Builder addCourse(Course course) {
        pmock.courses.add(course);
        return this;
      }

      public Builder removeCourse(Long courseId) {
        pmock.courses.removeIf(course -> Objects.equals(course.getId(), courseId));
        return this;
      }
      
      public Builder mockCourses() throws Exception {
        List<String> payloads = new ArrayList<>();
        for (Course course : pmock.courses) {
          String courseJson = pmock.objectMapper.writeValueAsString(course);
          
          stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d", course.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(courseJson)
              .withStatus(200)));
          
          stubFor(put(urlEqualTo(String.format("/1/courses/courses/%d", course.getId())))
              .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(courseJson)
                .withStatus(200)));
          
          mockCourseSignupGroups(course.getId());
          payloads.add(pmock.objectMapper.writeValueAsString(new WebhookCourseCreatePayload(course.getId())));
          pmock.payloads.add(pmock.objectMapper.writeValueAsString(new WebhookCourseCreatePayload(course.getId())));
        }

        String courseArrayJson = pmock.objectMapper.writeValueAsString(pmock.courses);
        
        stubFor(get(urlEqualTo("/1/courses/courses"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(courseArrayJson)
            .withStatus(200)));

        stubFor(get(urlMatching("/1/courses/courses?filterArchived=false&firstResult=.*&maxResults=.*"))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(courseArrayJson)
              .withStatus(200)));
        
        for (String payload : payloads) {
          TestUtilities.webhookCall("http://dev.muikku.fi:" + System.getProperty("it.port.http") + "/pyramus/webhook", payload);
        }
        return this;
      }

      public Builder mockCourseSignupGroups(Long courseId) throws JsonProcessingException {
        List<CourseSignupStudyProgramme> courseSignupStudyProgrammes = pmock.signupStudyProgrammes.get(courseId) != null ? 
            pmock.signupStudyProgrammes.get(courseId) : Collections.emptyList();
        
        for (CourseSignupStudyProgramme signupStudyProgramme : courseSignupStudyProgrammes) {
          stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/signupStudyProgrammes/%d", courseId, signupStudyProgramme.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(signupStudyProgramme))
              .withStatus(200)));          
        }
        
        stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/signupStudyProgrammes", courseId)))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(courseSignupStudyProgrammes))
            .withStatus(200)));

        List<CourseSignupStudentGroup> courseSignupStudentGroups = pmock.signupStudentGroups.get(courseId) != null ?
            pmock.signupStudentGroups.get(courseId) : Collections.emptyList();
        
        for (CourseSignupStudentGroup signupStudentGroup : courseSignupStudentGroups) {
          stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/signupStudentGroups/%d", courseId, signupStudentGroup.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(signupStudentGroup))
              .withStatus(200)));          
        }
        
        stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/signupStudentGroups", courseId)))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(courseSignupStudentGroups))
            .withStatus(200)));
        
        return this;
      }
      
      public Builder mockStudentCourseStats(Long studentId, int completedCourses) throws JsonProcessingException {
        StudentCourseStats studentCourseStats = new StudentCourseStats();
        studentCourseStats.setNumberCompletedCourses(completedCourses);
        stubFor(get(urlPathEqualTo(String.format("/1/students/students/%d/courseStats", studentId)))
            .withQueryParam("educationTypeCode", matching(".*"))
            .withQueryParam("educationSubtypeCode", matching(".*"))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(studentCourseStats))
              .withStatus(200)));
        
        return this;
      }
      
      public Builder mockDefaultOrganization() throws Exception {
        List<String> payloads = new ArrayList<>();
        Organization organization = new Organization(1l, "Default Test Organization", false);
        pmock.organizations.add(organization);
        Organization[] organizations = { organization };
 
        String organizationsJson = pmock.objectMapper.writeValueAsString(organizations);
        stubFor(get(urlEqualTo("/1/organizations"))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(organizationsJson)
              .withStatus(200)));
        for (Organization organization2 : pmock.organizations) {
          String organizationJson = pmock.objectMapper.writeValueAsString(organization2);

          stubFor(get(urlEqualTo(String.format("/1/organizations/%d", organization2.getId())))
              .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(organizationJson)
                .withStatus(200)));
          payloads.add(pmock.objectMapper.writeValueAsString(new WebhookOrganizationCreatePayload(organization2.getId(), organization2.getName())));
          pmock.payloads.add(pmock.objectMapper.writeValueAsString(new WebhookOrganizationCreatePayload(organization2.getId(), organization2.getName())));
        }
        for (String payload : payloads) {
          TestUtilities.webhookCall("http://dev.muikku.fi:" + System.getProperty("it.port.http") + "/pyramus/webhook", payload);
        }
        return this;
      }
      
      public Builder mockResetCredentials(String username) throws JsonProcessingException {
        CredentialResetPayload credentialReset = new CredentialResetPayload();
        credentialReset.setUsername(username);
        String resetJson = pmock.objectMapper.writeValueAsString(credentialReset);
        stubFor(get(urlEqualTo("/1/muikku/resetCredentials/537503611c89b2ea0f198ab937f3feb8"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(resetJson)
            .withStatus(200)));
        return this;
      }

      public Builder mockResetCredentialsPost() throws JsonProcessingException {
        stubFor(post(urlEqualTo("/1/muikku/resetCredentials"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withStatus(204)));
        return this;
      }
      
      public Builder mockLogin(MockLoggable loggable) throws JsonProcessingException {
        stubFor(get(urlEqualTo("/dnm")).willReturn(aResponse().withHeader("Content-Type", "application/json").withBody("").withStatus(204)));

        stubFor(get(urlMatching("/users/authorize.*"))
          .willReturn(aResponse()
            .withStatus(302)
            .withHeader("Location",
              "http://dev.muikku.fi:" + System.getProperty("it.port.http") + "/login?_stg=rsp&code=1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111")));

        stubFor(post(urlEqualTo("/1/oauth/token"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody("{\"expires_in\":3600,\"refresh_token\":\"12312ewsdf34fsd234r43rfsw32rf33e\",\"access_token\":\"ur84ur839843ruwf39843ru39ru37y2e\"}")
            .withStatus(200)));
        
        List<String> emails = new ArrayList<String>();
        emails.add(loggable.getEmail());
        WhoAmI whoAmI = new WhoAmI(loggable.getId(), loggable.getFirstName(), loggable.getLastName(), emails);

        stubFor(get(urlEqualTo("/1/system/whoami"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(whoAmI))
            .withStatus(200)));
        
        stubFor(get(urlEqualTo("/users/logout.page?redirectUrl=http://dev.muikku.fi:" + System.getProperty("it.port.http")))
          .willReturn(aResponse()
            .withStatus(302)
            .withHeader("Location", "http://dev.muikku.fi:" + System.getProperty("it.port.http") + "/")));
        
        if (loggable instanceof MockStudent) {
          mockEmptyStudyActivity();
          mockCourseMatrix();
        }
        
        return this;
      }
      
      public Builder clearLoginMock() throws JsonProcessingException  {
        stubFor(get(urlEqualTo("/dnm")).willReturn(aResponse().withHeader("Content-Type", "application/json").withBody("").withStatus(204)));

//      Fake "Pyramus" login screen
        stubFor(get(urlMatching("/users/authorize.*"))
          .willReturn(aResponse()
              .withHeader("Content-Type", "text/html; charset=utf-8")
              .withBody("<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"><title>Sisäänkirjautuminen</title></head><body><div id=loginRequired>Kirjaudu sisään</div></body></html>")
              .withStatus(200)));

        stubFor(post(urlEqualTo("/1/oauth/token"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody("")
            .withStatus(200)));

        stubFor(get(urlEqualTo("/1/system/whoami"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody("")
            .withStatus(200)));
        
        stubFor(get(urlEqualTo("/users/logout.page?redirectUrl=http://dev.muikku.fi:" + System.getProperty("it.port.http")))
          .willReturn(aResponse()
            .withStatus(302)
            .withHeader("Location", "http://dev.muikku.fi:" + System.getProperty("it.port.http") + "/")));
        
        return this;
      }
      
      public Builder mockMatriculationEligibility(Long studentId, boolean upperSecondarySchoolCurriculum) throws JsonProcessingException {
        MatriculationEligibilities eligibles = new MatriculationEligibilities(upperSecondarySchoolCurriculum);
        String eligibilityJson = pmock.objectMapper.writeValueAsString(eligibles);
        stubFor(get(urlEqualTo("/1/matriculation/eligibility"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(eligibilityJson)
            .withStatus(200)));
        stubFor(get(urlEqualTo(String.format("/1/matriculation/students/%d/eligibility", studentId)))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(eligibilityJson)
              .withStatus(200)));
        return this;
      }
      
      public Builder mockMatriculationExam(Boolean onlyEligible) throws JsonProcessingException {     
        Date startDate = new Date();
        Date endDate = new Date(TestUtilities.toDate(2025, 12, 12).toInstant().toEpochMilli());
        PyramusMatriculationExam result = new PyramusMatriculationExam();
        result.setEligible(true);
        result.setEnds(endDate.getTime());
        result.setEnrolled(false);
        result.setId(1l);
        result.setStarts(startDate.getTime());
        ArrayList<PyramusMatriculationExam> exams = new ArrayList<>();
        exams.add(result);
        String examsJson = pmock.objectMapper.writeValueAsString(exams);
        
        stubFor(get(urlEqualTo(String.format("/1/matriculation/exams?onlyEligible=%s", onlyEligible)))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(examsJson)
            .withStatus(200)));
        return this;
      }
      
      public Builder mockStudentsMatriculationEligibility(StudentMatriculationEligibilityOPS2021 studentMatriculationEligibility, String subjectCode) throws JsonProcessingException {
        String matriculationSubjectJson = pmock.objectMapper.writeValueAsString(studentMatriculationEligibility);
        UrlPathPattern urlPattern = new UrlPathPattern(matching("/1/matriculation/students/.*/matriculationEligibility"), true);
        stubFor(get(urlPattern)
            .withQueryParam("subjectCode", matching(subjectCode))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(matriculationSubjectJson)
            .withStatus(200)));      
        return this;
      }
      
      public Builder mockCourseAssessmentPrice(Long courseId, CourseAssessmentPrice coursePrice) throws JsonProcessingException {
        String priceJson = pmock.objectMapper.writeValueAsString(coursePrice);

        stubFor(get(urlEqualTo(String.format("/1/courses/courses/%s/assessmentPrice", courseId)))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(priceJson)
              .withStatus(200)));
          return this;
        
      }
      
      public Builder mockWorkspaceBilledPriceUpdate(String price) throws JsonProcessingException {
        WorklistItemBilledPriceRestModel billedPrice = new WorklistItemBilledPriceRestModel();
        billedPrice.setAssessmentIdentifier("1");
        billedPrice.setPrice(Double.valueOf(price));
        billedPrice.setEditable(true);

        stubFor(put(urlEqualTo("/1/worklist/billedPrice"))
            .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pmock.objectMapper.writeValueAsString(billedPrice))
                .withStatus(200)));
        return this;
      }
      
      public Builder mockWorkspaceBilledPrice(String price) throws JsonProcessingException {
        WorklistItemBilledPriceRestModel billedPrice = new WorklistItemBilledPriceRestModel();
        billedPrice.setAssessmentIdentifier("1");
        billedPrice.setPrice(Double.valueOf(price));
        billedPrice.setEditable(true);
        
        stubFor(get(urlMatching("/1/worklist/billedPrice"))
            .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pmock.objectMapper.writeValueAsString(billedPrice))
                .withStatus(200)));
        return this;
      }

      public Builder mockCourseActivities() throws JsonProcessingException {
        for (MockCourseStudent mcs : pmock.mockCourseStudents) {
          // TODO Hardcoded courseActivityInfo fields
          CourseActivityInfo courseActivityInfo = new CourseActivityInfo();
          courseActivityInfo.setLineName("Nettilukio");
          courseActivityInfo.setLineCategory("Lukio");
          courseActivityInfo.setDefaultLine(true);
          courseActivityInfo.setActivities(mcs.getCourseActivities());
          
          for (CourseActivity ca : mcs.getCourseActivities()) {
            Course course = mcs.getCourse();
            String courseName = course.getName();
            if (!StringUtils.isEmpty(course.getNameExtension())) {
              courseName = String.format("%s (%s)", courseName, course.getNameExtension());
            }
            ca.setCourseName(courseName);  
          }
          
          stubFor(get(urlPathEqualTo(String.format("/1/students/students/%d/courseActivity", mcs.getStudentId())))
              .withQueryParam("courseIds", matching(".*"))
              .withQueryParam("includeTransferCredits", matching(".*"))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(courseActivityInfo))
              .withStatus(200)));
          
          stubFor(get(urlMatching(String.format("/1/students/students/%d/courseActivity", mcs.getStudentId())))
              .willReturn(aResponse()
                  .withHeader("Content-Type", "application/json")
                  .withBody(pmock.objectMapper.writeValueAsString(courseActivityInfo))
                  .withStatus(200)));
        }
        return this;
      }
          
      public Builder mockStudyTimeIncrease(MockStudent mockStudent, int months) throws JsonProcessingException {
        this.updateStudent(mockStudent);
        stubFor(post(urlEqualTo(String.format("/1/students/students/%d/increaseStudyTime?months=%d", mockStudent.getId(), months)))
          .willReturn(aResponse()
            .withHeader("Content-type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(TestUtilities.studentFromMockStudent(mockStudent)))
            .withStatus(200)));        
        return this;
      }
      
//    This is actually mocking cpu payment service, but not getting it's own class.  
      public Builder mockCeeposRequestPayment(String orderNo, String refNo, String cSalt, String hash, String returnAppUrl, int retStatus) throws JsonProcessingException {
        String returnAddress = returnAppUrl + "/ceepos/done?Id=" + orderNo + "&Status=" + retStatus + "&Reference=" + refNo +"&Hash=" + hash;
        StringBuilder sb = new StringBuilder();
        sb.append(orderNo);
        sb.append("&");
        sb.append(2);
        sb.append("&");
        sb.append(refNo);
        sb.append("&");
        sb.append("new payment");
        sb.append("&");
        sb.append(returnAddress);
        sb.append("&");
        sb.append(cSalt);
        String expectedHash = Hashing.sha256().hashString(sb.toString(), StandardCharsets.UTF_8).toString();
        CeeposPaymentResponseRestModel response = new CeeposPaymentResponseRestModel(orderNo, 2, refNo, "new payment", returnAddress, expectedHash);
        stubFor(post(urlEqualTo("/ceeposrequestpayment"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(response))
            .withStatus(200)));
        return this;
      }
      
      public Builder mockEmptyStudyActivity() throws JsonProcessingException {
        UrlPathPattern urlPattern = new UrlPathPattern(matching("/1/muikku/students/.*/studyActivity"), true);
        pmock.studyActivity.setItems(new ArrayList<StudyActivityItemRestModel>());
        pmock.studyActivity.setEducationType("Lukio");
        stubFor(get(urlPattern)
            .withQueryParam("courseId", matching(".*"))
            .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pmock.objectMapper.writeValueAsString(pmock.studyActivity))
                .withStatus(200)));
        stubFor(get(urlPattern)
            .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pmock.objectMapper.writeValueAsString(pmock.studyActivity))
                .withStatus(200)));
        return this;
      }

      public Builder mockStudyActivity(List<StudyActivityItemRestModel> sairmList) throws JsonProcessingException {
        UrlPathPattern urlPattern = new UrlPathPattern(matching("/1/muikku/students/.*/studyActivity"), true);      
        pmock.studyActivity.setItems(sairmList);
        pmock.studyActivity.setEducationType("Lukio");
        pmock.studyActivity.setCompletedCourseCredits(sairmList.iterator().next().getLength());
        stubFor(get(urlPattern)
            .withQueryParam("courseId", matching(".*"))
            .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pmock.objectMapper.writeValueAsString(pmock.studyActivity))
                .withStatus(200)));
        stubFor(get(urlPattern)
            .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pmock.objectMapper.writeValueAsString(pmock.studyActivity))
                .withStatus(200)));
        return this;
      }
      
      public Builder mockUserContact(MockStudent mockStudent) throws JsonProcessingException {
        List<fi.otavanopisto.pyramus.rest.model.UserContact> userContacts = new ArrayList<>();
        UserContact userContact = new UserContact(mockStudent.getId(), mockStudent.getFirstName() + " " + mockStudent.getLastName(), "0800123123", mockStudent.getEmail(), "test street", "0280128", "Testville", "Test city", "", true, null);
        userContacts.add(userContact);
        stubFor(get(urlEqualTo(String.format("/1/contacts/users/%d/contacts", mockStudent.getId())))
            .willReturn(aResponse()
              .withHeader("Content-type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(userContacts))
              .withStatus(200))); 
        return this;
      }
      
      public Builder mockCourseMatrix() throws JsonProcessingException {
        UrlPathPattern urlPattern = new UrlPathPattern(matching("/1/muikku/students/.*/courseMatrix"), true);
        HopsCourseMatrix hopsCourseMatrix = new HopsCourseMatrix();
        hopsCourseMatrix.setProblems(Collections.emptySet());
        hopsCourseMatrix.setSubjects(new ArrayList<>());
        hopsCourseMatrix.setType(HopsCourseMatrixType.UPPER_SECONDARY);
        stubFor(get(urlPattern)
            .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pmock.objectMapper.writeValueAsString(hopsCourseMatrix))
                .withStatus(200)));
        return this;
      }
      
      public Builder build() throws Exception {
        mockDefaultOrganization();
        mockStudyProgrammes();
        mockStudentGroups();
        mockContactTypes();
        mockCourses();
        mockCourseEducationTypes();
        mockCourseTypes();
        mockCourseStaffMembers();
        mockCourseStudents();
        
        mockGradesAndScales();
        mockEducationalTimeUnits();
        mockCurriculums();
        mockEducationTypes();
        mockSubjects();

        mockPersons();
        mockStudents();
        mockStaffMembers();
        
        mockCourseActivities();
        for (String payload : pmock.payloads) {
          TestUtilities.webhookCall("http://dev.muikku.fi:" + System.getProperty("it.port.http") + "/pyramus/webhook", payload);
        }

        return this;
      }
      
      public Builder wiremockReset() {
        WireMock.reset();
        return this;
      }
      
      public Builder dumpMocks() {
        System.out.print("dumpMocks");
        
        ListStubMappingsResult listAllStubMappings = WireMock.listAllStubMappings();
        List<StubMapping> mappings = listAllStubMappings.getMappings();
        for (StubMapping mapping : mappings) {
          System.out.print(mapping.toString());
        }
          
        return this;
      }
      
      public Builder showMatchedServeEvents() {
        System.out.print("Show all matched events");
        List<ServeEvent> allServeEvents = WireMock.getAllServeEvents();
        List<String> used = new ArrayList<>();
        for (ServeEvent serveEvent : allServeEvents) {
          if (serveEvent.getWasMatched()) {
            if(!used.contains(serveEvent.getStubMapping().toString())) {
              System.out.print(serveEvent.getStubMapping().toString());
              used.add(serveEvent.getStubMapping().toString());
            }
          }
        }
        return this;
      }
      
      public Builder mockYourself() throws JsonProcessingException {
        ListStubMappingsResult listAllStubMappings = WireMock.listAllStubMappings();
        List<StubMapping> mappings = listAllStubMappings.getMappings();
        List<String> mappingStrings = new ArrayList<>();
        for (StubMapping mapping : mappings) {
          mappingStrings.add("<div>");
          mappingStrings.add(mapping.toString());
          mappingStrings.add("</div>");
        }
        
        stubFor(get(urlEqualTo("/1/me"))
            .willReturn(aResponse()
              .withHeader("Content-Type", "text/html")
              .withBody(pmock.objectMapper.writeValueAsString(mappingStrings))
              .withStatus(200)));
        return this;
      }
      
      public Builder resetBuilder() {
        pmock.students = new ArrayList<>();
        pmock.staffMembers = new ArrayList<>();
        pmock.persons = new ArrayList<>();
        pmock.gradingScales = new HashMap<>();
        pmock.educationalTimeUnits = new ArrayList<>();
        pmock.educationTypes = new ArrayList<>();
        pmock.subjects = new ArrayList<>();
        pmock.studyProgrammeCategories = new ArrayList<>();
        pmock.studyProgrammes = new ArrayList<>();
        pmock.courseTypes = new ArrayList<>();
        pmock.courseStudents = new HashMap<>();
        pmock.courseStaffMembers = new HashMap<>();
        pmock.studentGroupUsers = new HashMap<>();
        pmock.studentGroups = new ArrayList<>();
        pmock.payloads = new ArrayList<>();
        pmock.compositeCourseAssessmentRequests = new HashMap<>();
        pmock.compositeStaffAssessmentRequests = new HashMap<>();
        pmock.courses = new ArrayList<>();
        pmock.organizations = new ArrayList<>();
        pmock.studyActivity = new StudyActivityRestModel();
        WireMock.reset();
        return this;
      }

  }
  
  public List<MockStudent> getStudents() {
    return students;
  }

  public List<MockStaffMember> getStaffMembers() {
    return staffMembers;
  }

  public List<Person> getPersons() {
    return persons;
  }

  public ObjectMapper getObjectMapper() {
    return objectMapper;
  }

  public HashMap<GradingScale, List<Grade>> getGradingScales() {
    return gradingScales;
  }

  public List<EducationalTimeUnit> getEducationalTimeUnits() {
    return educationalTimeUnits;
  }

  public List<EducationType> getEducationTypes() {
    return educationTypes;
  }

  public List<Subject> getSubjects() {
    return subjects;
  }

  public List<StudyProgrammeCategory> getStudyProgrammeCategories() {
    return studyProgrammeCategories;
  }

  public List<StudyProgramme> getStudyProgrammes() {
    return studyProgrammes;
  }

  public List<CourseType> getCourseTypes() {
    return courseTypes;
  }

  public HashMap<Long, List<CourseStudent>> getCourseStudents() {
    return courseStudents;
  }

  public HashMap<Long, List<CourseStaffMember>> getCourseStaffMembers() {
    return courseStaffMembers;
  }

  public HashMap<Long, List<Object>> getStudentGroups() {
    return studentGroupUsers;
  }

  public void setStudentGroups(HashMap<Long, List<Object>> studentGroups) {
    this.studentGroupUsers = studentGroups;
  }

  private List<MockStudent> students = new ArrayList<>();
  private List<MockStaffMember> staffMembers = new ArrayList<>();
  private List<Person> persons = new ArrayList<>();
  private ObjectMapper objectMapper;
  private HashMap<GradingScale, List<Grade>> gradingScales = new HashMap<>();
  private List<EducationalTimeUnit> educationalTimeUnits = new ArrayList<>();
  private List<EducationType> educationTypes = new ArrayList<>();
  private List<Subject> subjects = new ArrayList<>();
  private List<StudyProgrammeCategory> studyProgrammeCategories = new ArrayList<>();
  private List<StudyProgramme> studyProgrammes = new ArrayList<>();
  private List<CourseType> courseTypes = new ArrayList<>();
  private HashMap<Long, List<CourseStudent>> courseStudents = new HashMap<>();
  private HashMap<Long, List<CourseStaffMember>> courseStaffMembers = new HashMap<>();
  private HashMap<Long, List<Object>> studentGroupUsers = new HashMap<>();
  private List<StudentGroup> studentGroups = new ArrayList<>();
  private List<String> payloads = new ArrayList<>();
  private HashMap<Long, List<CompositeAssessmentRequest>> compositeCourseAssessmentRequests = new HashMap<>();
  private HashMap<Long, List<CompositeAssessmentRequest>> compositeStaffAssessmentRequests = new HashMap<>();
  private List<Course> courses = new ArrayList<>();
  private List<Organization> organizations = new ArrayList<>();
  private HashMap<Long, List<CourseSignupStudyProgramme>> signupStudyProgrammes = new HashMap<>();
  private HashMap<Long, List<CourseSignupStudentGroup>> signupStudentGroups = new HashMap<>();
  private List<MockCourseStudent> mockCourseStudents = new ArrayList<>();
  private StudyActivityRestModel studyActivity = new StudyActivityRestModel();
}