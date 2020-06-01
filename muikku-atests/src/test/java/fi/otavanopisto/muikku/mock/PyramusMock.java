package fi.otavanopisto.muikku.mock;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.post;
import static com.github.tomakehurst.wiremock.client.WireMock.put;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.github.tomakehurst.wiremock.client.WireMock.urlMatching;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.apache.commons.codec.digest.DigestUtils;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JSR310Module;
import com.github.tomakehurst.wiremock.admin.model.ListStubMappingsResult;
import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.stubbing.ServeEvent;
import com.github.tomakehurst.wiremock.stubbing.StubMapping;

import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.mock.model.MockCourseStudent;
import fi.otavanopisto.muikku.mock.model.MockLoggable;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.pyramus.rest.model.ContactType;
import fi.otavanopisto.pyramus.rest.model.Course;
import fi.otavanopisto.pyramus.rest.model.CourseAssessment;
import fi.otavanopisto.pyramus.rest.model.CourseAssessmentRequest;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMember;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMemberRole;
import fi.otavanopisto.pyramus.rest.model.CourseStudent;
import fi.otavanopisto.pyramus.rest.model.CourseType;
import fi.otavanopisto.pyramus.rest.model.EducationType;
import fi.otavanopisto.pyramus.rest.model.EducationalTimeUnit;
import fi.otavanopisto.pyramus.rest.model.Email;
import fi.otavanopisto.pyramus.rest.model.Grade;
import fi.otavanopisto.pyramus.rest.model.GradingScale;
import fi.otavanopisto.pyramus.rest.model.Organization;
import fi.otavanopisto.pyramus.rest.model.Person;
import fi.otavanopisto.pyramus.rest.model.StaffMember;
import fi.otavanopisto.pyramus.rest.model.Student;
import fi.otavanopisto.pyramus.rest.model.StudentGroup;
import fi.otavanopisto.pyramus.rest.model.StudentGroupStudent;
import fi.otavanopisto.pyramus.rest.model.StudentGroupUser;
import fi.otavanopisto.pyramus.rest.model.StudyProgramme;
import fi.otavanopisto.pyramus.rest.model.StudyProgrammeCategory;
import fi.otavanopisto.pyramus.rest.model.Subject;
import fi.otavanopisto.pyramus.rest.model.UserCredentials;
import fi.otavanopisto.pyramus.rest.model.WhoAmI;
import fi.otavanopisto.pyramus.rest.model.composite.CompositeAssessmentRequest;
import fi.otavanopisto.pyramus.rest.model.composite.CompositeGrade;
import fi.otavanopisto.pyramus.rest.model.composite.CompositeGradingScale;
import fi.otavanopisto.pyramus.rest.model.muikku.CredentialResetPayload;
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
        pmock.objectMapper = new ObjectMapper().registerModule(new JSR310Module()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        
        GradingScale gs = new GradingScale(1l, "Pass/Fail", "Passed or failed scale", false);
        List<Grade> grades = new ArrayList<>();
        grades.add(new Grade(1l, "Excellent", "Excellent answer showing expertise in area of study", 1l, true, "0", null, false));
        grades.add(new Grade(2l, "Failed", "Failed answer. Not proving any expertise in the matter.", 1l, false, "1", null, false));
        pmock.gradingScales.put(gs, grades);
        
        pmock.educationalTimeUnits.add(new EducationalTimeUnit((long) 1, "test time unit", "h", (double) 1, false));
        pmock.educationTypes.add(new EducationType((long) 1, "testEduType", "ET", false));
        pmock.subjects.add(new Subject((long) 1, "tc_11", "Test course", (long) 1, false));
        
        pmock.studyProgrammeCategories.add(new StudyProgrammeCategory(1l, "All Study Programmes", 1l, false));
        pmock.studyProgrammes.add(new StudyProgramme(1l, 1l, "test", "Test Study Programme", 1l, false, false));
        
        pmock.courseTypes.add(new fi.otavanopisto.pyramus.rest.model.CourseType((long) 1, "Nonstop", false));
        pmock.courseTypes.add(new fi.otavanopisto.pyramus.rest.model.CourseType((long) 2, "Ryhmäkurssi", false));        
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
        CourseStudent courseStudent = TestUtilities.courseStudentFromMockCourseStudent(mockCourseStudent);
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
      public Builder addStudentGroup(Long id, Long organizationId, String name, String description, Long creatorId, boolean archived) {
        OffsetDateTime date = OffsetDateTime.of(2015, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC);
        List<String> tags = new ArrayList<>();
        pmock.studentGroups.add(new StudentGroup(id, name, description, date, creatorId, date, creatorId, date, tags, false, organizationId, archived));
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
        StudentGroupUser studentGroupUser = new StudentGroupUser(staffMember.getId(), staffMember.getId());
          if(pmock.studentGroupUsers.containsKey(userGroupId)){
            pmock.studentGroupUsers.get(userGroupId).add(studentGroupUser);
          }else{
            List<Object> sgsList = new ArrayList<>();
            sgsList.add(studentGroupUser);
            pmock.studentGroupUsers.put(userGroupId, sgsList);
          }
        return this;
      }
      
      public Builder mockStudentGroups() throws JsonProcessingException {
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
            }else if(o instanceof StudentGroupUser){
              StudentGroupUser sgUser = (StudentGroupUser) o;
              users.add(sgUser);
                stubFor(get(urlMatching(String.format("/1/students/studentGroups/%d/staffmembers/%d", groupId, sgUser.getStaffMemberId())))
                .willReturn(aResponse()
                  .withHeader("Content-Type", "application/json")
                  .withBody(pmock.objectMapper.writeValueAsString(sgUser))
                  .withStatus(200)));
              pmock.payloads.add(pmock.objectMapper.writeValueAsString(new WebhookStudentGroupStaffMemberCreatePayload(sgUser.getId(), groupId, sgUser.getStaffMemberId())));
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
        return this;
      }
      
      public Builder addCourseStudents(HashMap<Long, List<MockCourseStudent>> mockCourseStudents){
        HashMap<Long, List<CourseStudent>> cStudents = new HashMap<>();
        for (Long courseId : mockCourseStudents.keySet()) {
          List<CourseStudent> cst = new ArrayList<>();
          for(MockCourseStudent cs : mockCourseStudents.get(courseId)) {
            cst.add(TestUtilities.courseStudentFromMockCourseStudent(cs));
          }
          cStudents.put(courseId, cst);
        }
        pmock.courseStudents = cStudents;
        return this;
      }
      
      public Builder addCourseType(CourseType courseType) throws JsonProcessingException {
        pmock.courseTypes.add(courseType);
        return this;
      }
      
      public Builder mockCourseStudents() throws JsonProcessingException {
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

        return this;
      }
          
      public Builder mockCourseStaffMembers() throws JsonProcessingException {
        Set<Long> courseIds = pmock.courseStaffMembers.keySet(); 
        for (Long courseId : courseIds) {
          List<CourseStaffMember> courseStaffMembers = pmock.courseStaffMembers.get(courseId);
          for (CourseStaffMember cs : courseStaffMembers) {
            stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/staffMembers/%d", cs.getCourseId(), cs.getId())))
              .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pmock.objectMapper.writeValueAsString(cs))
                .withStatus(200))); 
            pmock.payloads.add(pmock.objectMapper.writeValueAsString(new WebhookCourseStaffMemberCreatePayload(cs.getId(), 
              cs.getCourseId(), cs.getStaffMemberId())));          
          }
          stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/staffMembers", courseId)))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(pmock.courseStaffMembers.get(courseId)))
              .withStatus(200)));
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
        }
        
        stubFor(get(urlEqualTo("/1/common/subjects"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(pmock.subjects))
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
    
      public Builder mockStudents() throws JsonProcessingException{

        List<Student> studentsList = new ArrayList<>();
        for (MockStudent mockStudent : pmock.students) {
          Student student = TestUtilities.studentFromMockStudent(mockStudent);
                
          stubFor(get(urlEqualTo(String.format("/1/students/students/%d", student.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(student))
              .withStatus(200)));

          Email email = new Email(student.getId(), (long) 1, true, mockStudent.getEmail());
          Email[] emails = { email };
          
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
          
          stubFor(get(urlMatching(String.format("/1/persons/persons/%d/students", student.getPersonId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(studentArray))
              .withStatus(200)));
          
          studentsList.add(student);
          pmock.payloads.add(pmock.objectMapper.writeValueAsString(new WebhookStudentCreatePayload(student.getId())));
        }
        
        stubFor(get(urlMatching("/1/students/students?filterArchived=false&firstResult=.*&maxResults=.*"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(studentsList))
            .withStatus(200)));

        stubFor(get(urlEqualTo("/1/students/students"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(studentsList))
            .withStatus(200)));
        
        return this;
      }
      
      public Builder mockPersons() throws JsonProcessingException {
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
        }
        
        stubFor(get(urlMatching("/1/persons/persons?filterArchived=.*"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(pmock.persons))
            .withStatus(200)));

        stubFor(get(urlEqualTo("/1/persons/persons"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(pmock.persons))
            .withStatus(200)));

        return this;
      }
      
      public Builder mockStudyProgrammes() throws JsonProcessingException {       
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
      
      public Builder mockStaffMembers() throws JsonProcessingException {
        Map<String, String> variables = new HashMap<String, String>();
        List<String> tags = new ArrayList<>();
        List<StaffMember> staffs = new ArrayList<>();
        for (MockStaffMember mockStaffMember : pmock.staffMembers) {
          StaffMember staffMember = new StaffMember(mockStaffMember.getId(), mockStaffMember.getPersonId(), mockStaffMember.getOrganizationId(), null, mockStaffMember.getFirstName(), mockStaffMember.getLastName(), null, mockStaffMember.getRole(), tags, variables);

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
          
          Email email = new Email(staffMember.getId(), 1l, true, mockStaffMember.getEmail());
          Email[] emails = { email };

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
          pmock.payloads.add(pmock.objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload(staffMember.getId())));
        }
        
        stubFor(get(urlEqualTo("/1/staff/members"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(staffs))
            .withStatus(200)));
        
        return this;
      }
      
      public Builder mockCourseStaffMemberRoles() throws JsonProcessingException {
        
        CourseStaffMemberRole teacherRole = new CourseStaffMemberRole((long) 7, "Opettaja");
        CourseStaffMemberRole[] cRoleArray = { teacherRole };

        stubFor(get(urlEqualTo("/1/courses/staffMemberRoles"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(cRoleArray))
            .withStatus(200)));
        
        for (CourseStaffMemberRole role : cRoleArray) {
          stubFor(get(urlEqualTo(String.format("/1/courses/staffMemberRoles/%d", role.getId())))
              .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pmock.objectMapper.writeValueAsString(role))
                .withStatus(200)));
        }
        return this;
      }
      
      public Builder mockAssessmentRequests(Long studentId, Long courseId, Long courseStudentId, String requestText, boolean archived, boolean handled, OffsetDateTime date) throws JsonProcessingException {
        List<CourseAssessmentRequest> assessmentRequests = new ArrayList<CourseAssessmentRequest>();
        CourseAssessmentRequest assessmentRequest = new CourseAssessmentRequest(1l, courseStudentId, date, requestText, archived, handled);
        assessmentRequests.add(assessmentRequest);
        
        stubFor(get(urlEqualTo(String.format("/1/students/students/%d/courses/%d/assessmentRequests/", studentId, courseId)))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(assessmentRequests))
            .withStatus(200)));
        
        stubFor(get(urlEqualTo(String.format("/1/students/%d/assessmentRequests/", studentId)))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(assessmentRequests))
              .withStatus(200)));
        
        stubFor(get(urlEqualTo(String.format("/1/students/%d/courses/%d/assessmentRequests/%d", studentId, courseId, assessmentRequest.getId())))
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
              compositeGrades));
        }
        
        stubFor(get(urlEqualTo("/1/composite/gradingScales/"))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(compositeGradingScales))
              .withStatus(200)));
              
        return this;
      }
      
      public Builder addCompositeCourseAssessmentRequest(Long studentId, Long courseId, Long courseStudentId, String requestText, boolean archived, boolean handled, Course course, MockStudent courseStudent, OffsetDateTime date) {
        OffsetDateTime enrollmemnt = OffsetDateTime.of(2010, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC);

        CourseAssessmentRequest courseAssessmentRequest = new CourseAssessmentRequest(1l, courseStudentId, date, requestText, archived, handled);
        
        CompositeAssessmentRequest assessmentRequest = new CompositeAssessmentRequest();
        assessmentRequest.setCourseStudentId(courseStudentId);
        assessmentRequest.setAssessmentRequestDate(Date.from(courseAssessmentRequest.getCreated().toInstant()));
        assessmentRequest.setCourseEnrollmentDate(Date.from(enrollmemnt.toInstant()));
        assessmentRequest.setEvaluationDate(null);
        assessmentRequest.setPassing(null);
        assessmentRequest.setCourseId(courseId);
        assessmentRequest.setCourseName(course.getName());
        assessmentRequest.setCourseNameExtension(course.getNameExtension());
        assessmentRequest.setFirstName(courseStudent.getFirstName());
        assessmentRequest.setLastName(courseStudent.getLastName());
        assessmentRequest.setStudyProgramme("Test Study Programme");
        assessmentRequest.setUserId(courseStudent.getId());
                
        if(pmock.compositeCourseAssessmentRequests.containsKey(courseId)){
          pmock.compositeCourseAssessmentRequests.get(courseId).add(assessmentRequest);
        }else{
          ArrayList<CompositeAssessmentRequest> assessmentRequests = new ArrayList<>();
          assessmentRequests.add(assessmentRequest);
          pmock.compositeCourseAssessmentRequests.put(courseId, assessmentRequests);
        }
        return this;
      }
      
      public Builder mockCompositeCourseAssessmentRequests() throws JsonProcessingException {        
        for (Long courseId : pmock.compositeCourseAssessmentRequests.keySet()) {
          stubFor(get(urlEqualTo(String.format("/1/composite/course/%d/assessmentRequests", courseId)))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pmock.objectMapper.writeValueAsString(pmock.compositeCourseAssessmentRequests.get(courseId)))
              .withStatus(200)));
        }

        return this;
      }
      
      public Builder addStaffCompositeAssessmentRequest(Long studentId, Long courseId, Long courseStudentId, String requestText, boolean archived, boolean handled, Course course, MockStudent courseStudent, Long staffMemberId, OffsetDateTime date) {
        OffsetDateTime enrollmemnt = OffsetDateTime.of(2010, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC);

        CourseAssessmentRequest courseAssessmentRequest = new CourseAssessmentRequest(1l, courseStudentId, date, requestText, archived, handled);
        
        CompositeAssessmentRequest assessmentRequest = new CompositeAssessmentRequest();

        assessmentRequest.setCourseStudentId(courseStudentId);
        assessmentRequest.setAssessmentRequestDate(Date.from(courseAssessmentRequest.getCreated().toInstant()));
        assessmentRequest.setCourseEnrollmentDate(Date.from(enrollmemnt.toInstant()));        
        assessmentRequest.setEvaluationDate(null);
        assessmentRequest.setPassing(null);
        assessmentRequest.setCourseId(courseId);
        assessmentRequest.setCourseName(course.getName());
        assessmentRequest.setCourseNameExtension(course.getNameExtension());
        assessmentRequest.setFirstName(courseStudent.getFirstName());
        assessmentRequest.setLastName(courseStudent.getLastName());
        assessmentRequest.setStudyProgramme("Test Study Programme");
        assessmentRequest.setUserId(courseStudent.getId());
                
        if(pmock.compositeStaffAssessmentRequests.containsKey(staffMemberId)){
          pmock.compositeStaffAssessmentRequests.get(staffMemberId).add(assessmentRequest);
        }else{
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
      
      public Builder mockCourseAssessments(MockCourseStudent courseStudent, MockStaffMember staffMember) throws JsonProcessingException {
        OffsetDateTime assessmentCreated = OffsetDateTime.of(2015, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC);
        CourseAssessment courseAssessment = new CourseAssessment(1l, courseStudent.getId(), 1l, 1l, staffMember.getId(), assessmentCreated, "Test evaluation.", Boolean.TRUE);
        
        stubFor(post(urlMatching(String.format("/1/students/students/%d/courses/%d/assessments/", courseStudent.getStudentId(), courseStudent.getCourseId())))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(courseAssessment))
            .withStatus(200)));

        List<CourseAssessment> courseAssessments = new ArrayList<CourseAssessment>();
        courseAssessments.add(courseAssessment);
        stubFor(get(urlEqualTo(String.format("/1/students/students/%d/courses/%d/assessments/", courseStudent.getStudentId(), courseStudent.getCourseId())))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(courseAssessments))
            .withStatus(200)));
        
        stubFor(get(urlEqualTo(String.format("/1/students/students/%d/courses/%d/assessments/%d", courseStudent.getStudentId(), courseStudent.getCourseId(), courseAssessment.getId())))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(courseAssessment))
            .withStatus(200)));

        stubFor(put(urlEqualTo(String.format("/1/students/students/%d/courses/%d/assessments/%d", courseStudent.getStudentId(), courseStudent.getCourseId(), courseAssessment.getId())))
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
      
      public Builder mockCourses() throws JsonProcessingException {

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
       
        return this;
      }
      
      public Builder mockDefaultOrganization() throws JsonProcessingException {
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
          pmock.payloads.add(pmock.objectMapper.writeValueAsString(new WebhookOrganizationCreatePayload(organization2.getId(), organization2.getName())));
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
      
//    Maybe?
//    CourseAssessment cAss = new fi.otavanopisto.pyramus.rest.model.CourseAssessment(null, courseStudent.getId(), 1l, 1l, staffMember.getId(), null, "<p>Test evaluation.</p>\n", Boolean.TRUE);
//    verify(postRequestedFor(urlEqualTo(String.format("/1/students/students/%d/courses/%d/assessments/", courseStudent.getStudentId(), courseStudent.getCourseId())))
//      .withHeader("Content-Type", equalTo("application/json"))
//      .withRequestBody(equalToJson(pmock.objectMapper.writeValueAsString(cAss), wiremock.org.skyscreamer.jsonassert.JSONCompareMode.LENIENT)));
//      waitForPresent(".notification-queue-item-success"); 
      
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
        
        stubFor(get(urlEqualTo("/users/logout.page?redirectUrl=https://dev.muikku.fi:" + System.getProperty("it.port.https")))
          .willReturn(aResponse()
            .withStatus(302)
            .withHeader("Location", "http://dev.muikku.fi:" + System.getProperty("it.port.http") + "/")));
        
        return this;
      }
      
      public Builder clearLoginMock() throws JsonProcessingException  {
        stubFor(get(urlEqualTo("/dnm")).willReturn(aResponse().withHeader("Content-Type", "application/json").withBody("").withStatus(204)));

        stubFor(get(urlMatching("/users/authorize.*"))
          .willReturn(aResponse()
            .withStatus(302)
            .withHeader("Location", "")));

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
        
        stubFor(get(urlEqualTo("/users/logout.page?redirectUrl=https://dev.muikku.fi:" + System.getProperty("it.port.https")))
          .willReturn(aResponse()
            .withStatus(302)
            .withHeader("Location", "http://dev.muikku.fi:" + System.getProperty("it.port.http") + "/")));
        
        return this;        
      }
      
      public Builder build() throws Exception {
        mockDefaultOrganization();        
        mockPersons();
        mockStudents();
        mockStaffMembers();

        mockContactTypes();
        mockStudyProgrammes();
        mockGradesAndScales();
        mockEducationalTimeUnits();
        mockEducationTypes();
        mockSubjects();
        mockCourses();
        mockCourseEducationTypes();
        mockCourseTypes();
        mockCourseStaffMembers();
        mockCourseStudents();
        mockCourseStaffMemberRoles();
        mockStudentGroups();
        
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
        pmock.organizations = new ArrayList<>();
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
}