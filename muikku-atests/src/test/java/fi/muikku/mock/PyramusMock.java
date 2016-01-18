package fi.muikku.mock;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.post;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.github.tomakehurst.wiremock.client.WireMock.urlMatching;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.joda.time.DateTime;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;
import com.github.tomakehurst.wiremock.client.WireMock;

import fi.muikku.TestUtilities;
import fi.muikku.mock.model.MockCourseStudent;
import fi.muikku.mock.model.MockLoggable;
import fi.muikku.mock.model.MockStaffMember;
import fi.muikku.mock.model.MockStudent;
import fi.pyramus.rest.model.ContactType;
import fi.pyramus.rest.model.CourseStaffMember;
import fi.pyramus.rest.model.CourseStaffMemberRole;
import fi.pyramus.rest.model.CourseStudent;
import fi.pyramus.rest.model.CourseType;
import fi.pyramus.rest.model.EducationType;
import fi.pyramus.rest.model.EducationalTimeUnit;
import fi.pyramus.rest.model.Email;
import fi.pyramus.rest.model.Grade;
import fi.pyramus.rest.model.GradingScale;
import fi.pyramus.rest.model.Person;
import fi.pyramus.rest.model.StaffMember;
import fi.pyramus.rest.model.Student;
import fi.pyramus.rest.model.StudyProgramme;
import fi.pyramus.rest.model.StudyProgrammeCategory;
import fi.pyramus.rest.model.Subject;
import fi.pyramus.rest.model.WhoAmI;
import fi.pyramus.webhooks.WebhookCourseStaffMemberCreatePayload;
import fi.pyramus.webhooks.WebhookCourseStudentCreatePayload;
import fi.pyramus.webhooks.WebhookPersonCreatePayload;
import fi.pyramus.webhooks.WebhookStaffMemberCreatePayload;
import fi.pyramus.webhooks.WebhookStudentCreatePayload;

public class PyramusMock {
    
  private PyramusMock() {
    objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
  }

  public static Builder mocker() {
      return new PyramusMock.Builder();
  }

  public static class Builder {
      private PyramusMock pyramusMocker = new PyramusMock();

      public Builder() {
//        Some defaults for mocks       
        GradingScale gradingScale = new GradingScale(1l, "Pass/Fail", "Passed or failed scale", false);
        Grade gradeExcellent = new Grade(1l, "Excellent", "Excellent answer showing expertise in area of study", 1l, true, "0", null, false);
        Grade gradeFailed = new Grade(2l, "Failed", "Failed answer. Not proving any expertise in the matter.", 1l, false, "1", null, false);
        addGrade(gradingScale, gradeExcellent);
        addGrade(gradingScale, gradeFailed);
        addEducationalTimeUnit(new EducationalTimeUnit((long) 1, "test time unit", "h", (double) 1, false));
        addEducationType(new EducationType((long) 1, "testEduType", "ET", false));
        addSubject(new Subject((long) 1, "tc_11", "Test course", (long) 1, false));
        addStudyProgrammeCategory(new StudyProgrammeCategory(1l, "All Study Programmes", 1l, false));
        addStudyProgramme(new StudyProgramme(1l, "test", "Test Study Programme", 1l, false));
        addCourseType(new fi.pyramus.rest.model.CourseType((long) 1, "Nonstop", false));        
      }

      public Builder addStudents(List<MockStudent> students) {
        for(MockStudent mockStudent : students) {
          Person person = new Person(mockStudent.getPersonId(), mockStudent.getBirthday(), mockStudent.getSocialSecurityNumber(), mockStudent.getSex(), false, "empty", mockStudent.getPersonId());
          pyramusMocker.persons.add(person);
        }
        pyramusMocker.students = students;
        return this;
      }

      public Builder addStudent(MockStudent mockStudent) {
        Person person = new Person(mockStudent.getPersonId(), mockStudent.getBirthday(), mockStudent.getSocialSecurityNumber(), mockStudent.getSex(), false, "empty", mockStudent.getPersonId());
        pyramusMocker.persons.add(person);
        pyramusMocker.students.add(mockStudent);
        return this;
      }
      
      public Builder addCourseStaffMembers(HashMap<Long, List<CourseStaffMember>> courseStaffMembers){
        pyramusMocker.courseStaffMembers = courseStaffMembers;
        return this;
      }
//    TODO: CourseAssessments
      public Builder addStaffMembers(List<MockStaffMember> staffMembers) {
        DateTime birthday = new DateTime(1990, 2, 2, 0, 0, 0, 0);
        for(MockStaffMember mockStaffMember : staffMembers) {
          Person person = new Person(mockStaffMember.getPersonId(), birthday, mockStaffMember.getSocialSecurityNumber(), mockStaffMember.getSex(), false, "empty", mockStaffMember.getPersonId());
          pyramusMocker.persons.add(person);
        }
        pyramusMocker.staffMembers = staffMembers;
        return this;
      }
      
      public Builder addStaffMember(MockStaffMember mockStaffMember) {
        DateTime birthday = new DateTime(1990, 2, 2, 0, 0, 0, 0);
        Person person = new Person(mockStaffMember.getPersonId(), birthday, mockStaffMember.getSocialSecurityNumber(), mockStaffMember.getSex(), false, "empty", mockStaffMember.getPersonId());
        pyramusMocker.persons.add(person);
        pyramusMocker.staffMembers.add(mockStaffMember);
        return this;
      }

      public Builder addCourseStudent(Long courseId, MockCourseStudent mockCourseStudent){
        CourseStudent courseStudent = TestUtilities.courseStudentFromMockCourseStudent(mockCourseStudent);
        if(pyramusMocker.courseStudents.containsKey(courseId)){
          pyramusMocker.courseStudents.get(courseId).add(courseStudent);
        }else{
          List<CourseStudent> courseStudentList = new ArrayList<>();
          courseStudentList.add(courseStudent);
          pyramusMocker.courseStudents.put(courseId, courseStudentList);
        }
        return this;
      }
      
      public Builder addCourseStaffMember(Long courseId, CourseStaffMember courseStaffMember){
        if(pyramusMocker.courseStaffMembers.containsKey(courseId)){
          pyramusMocker.courseStaffMembers.get(courseId).add(courseStaffMember);
        }else{
          List<CourseStaffMember> courseStaffMemberList = new ArrayList<>();
          courseStaffMemberList.add(courseStaffMember);
          pyramusMocker.courseStaffMembers.put(courseId, courseStaffMemberList);
        }
        return this;
      }
      
      public Builder addCourseStudents(HashMap<Long, List<MockCourseStudent>> mockCourseStudents){
        HashMap<Long, List<CourseStudent>> courseStudents = new HashMap<>();
        for (Long courseId : mockCourseStudents.keySet()) {
          List<CourseStudent> courseStudentList = new ArrayList<>();
          for(MockCourseStudent mockCourseStudent : mockCourseStudents.get(courseId)) {
            courseStudentList.add(TestUtilities.courseStudentFromMockCourseStudent(mockCourseStudent));
          }
          courseStudents.put(courseId, courseStudentList);
        }
        pyramusMocker.courseStudents = courseStudents;
        return this;
      }
      
      public Builder mockCourseStudents() throws JsonProcessingException, Exception {
        for (Long courseId : pyramusMocker.courseStudents.keySet()) {
          for (CourseStudent courseStudent : pyramusMocker.courseStudents.get(courseId)) {
            stubFor(get(urlMatching(String.format("/1/courses/courses/%d/students/%d", courseStudent.getCourseId(), courseStudent.getId())))
              .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pyramusMocker.objectMapper.writeValueAsString(courseStudent))
                .withStatus(200)));            
            pyramusMocker.payloads.add(pyramusMocker.objectMapper.writeValueAsString(new WebhookCourseStudentCreatePayload(courseStudent.getId(), 
              courseStudent.getCourseId(), courseStudent.getStudentId())));
          }
        
          stubFor(get(urlMatching(String.format("/1/courses/courses/%d/students?filterArchived=.*", courseId)))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pyramusMocker.objectMapper.writeValueAsString(pyramusMocker.courseStudents.get(courseId)))
              .withStatus(200)));
          
          stubFor(get(urlMatching(String.format("/1/courses/courses/%d/students", courseId)))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pyramusMocker.objectMapper.writeValueAsString(pyramusMocker.courseStudents.get(courseId)))
              .withStatus(200)));
        }

        return this;
      }
          
      public Builder mockCourseStaffMembers() throws JsonProcessingException, Exception {

        for (Long courseId : pyramusMocker.courseStaffMembers.keySet()) {
          for (CourseStaffMember cs : pyramusMocker.courseStaffMembers.get(courseId)) {
            stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/staffMembers/%d", cs.getCourseId(), cs.getId())))
              .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pyramusMocker.objectMapper.writeValueAsString(cs))
                .withStatus(200)));           
            pyramusMocker.payloads.add(pyramusMocker.objectMapper.writeValueAsString(new WebhookCourseStaffMemberCreatePayload(cs.getId(), 
              cs.getCourseId(), cs.getStaffMemberId())));          
          }
        
          stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/staffMembers", courseId)))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pyramusMocker.objectMapper.writeValueAsString(pyramusMocker.courseStaffMembers.get(courseId)))
              .withStatus(200)));
        }

        return this;
      }
      
      public Builder mockCourseTypes() throws JsonProcessingException {
        stubFor(get(urlEqualTo("/1/courses/courseTypes"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pyramusMocker.objectMapper.writeValueAsString(pyramusMocker.courseTypes))
            .withStatus(200)));
        
        for (CourseType courseType : pyramusMocker.courseTypes) {
          stubFor(get(urlEqualTo(String.format("/1/courses/courseTypes/%d", courseType.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pyramusMocker.objectMapper.writeValueAsString(courseType))
              .withStatus(200)));          
        }
        return this;
      }
      
      public Builder mockSubjects() throws JsonProcessingException {
        for (Subject subject : pyramusMocker.subjects) {
          stubFor(get(urlEqualTo(String.format("/1/common/subjects/%d", subject.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pyramusMocker.objectMapper.writeValueAsString(subject))
              .withStatus(200)));          
        }
        
        stubFor(get(urlEqualTo("/1/common/subjects"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pyramusMocker.objectMapper.writeValueAsString(pyramusMocker.subjects))
            .withStatus(200)));
        return this;
      }
      
      public Builder mockEducationTypes() throws JsonProcessingException {
        for (EducationType educationType : pyramusMocker.educationTypes) {
          stubFor(get(urlEqualTo(String.format("/1/common/educationTypes/%d", educationType.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pyramusMocker.objectMapper.writeValueAsString(educationType))
              .withStatus(200)));          
        }

        stubFor(get(urlEqualTo("/1/common/educationTypes"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pyramusMocker.objectMapper.writeValueAsString(pyramusMocker.educationTypes))
            .withStatus(200)));
        return this;
      }
      
      public Builder mockEducationalTimeUnits() throws JsonProcessingException {
        for (EducationalTimeUnit educationalTimeUnit : pyramusMocker.educationalTimeUnits) {
          stubFor(get(urlEqualTo("/1/common/educationalTimeUnits/1"))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pyramusMocker.objectMapper.writeValueAsString(educationalTimeUnit))
              .withStatus(200)));
        }
        stubFor(get(urlEqualTo("/1/common/educationalTimeUnits"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pyramusMocker.objectMapper.writeValueAsString(pyramusMocker.educationalTimeUnits))
            .withStatus(200)));
        return this;
      }
      
      public Builder mockGradesAndScales() throws JsonProcessingException {
        GradingScale gradingScale;
        Iterator<Entry<GradingScale, List<Grade>>> it = pyramusMocker.gradingScales.entrySet().iterator();
        while (it.hasNext()) {
            Entry<GradingScale, List<Grade>> gsPair = it.next();
            gradingScale = (GradingScale) gsPair.getKey();
            
            stubFor(get(urlEqualTo(String.format("/1/common/gradingScales/%d", gradingScale.getId())))
              .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pyramusMocker.objectMapper.writeValueAsString(gradingScale))
                .withStatus(200)));
            
            stubFor(get(urlEqualTo("/1/common/gradingScales"))
              .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pyramusMocker.objectMapper.writeValueAsString(gradingScale))
                .withStatus(200)));

            stubFor(get(urlEqualTo(String.format("/1/common/gradingScales/?filterArchived=true")))
              .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pyramusMocker.objectMapper.writeValueAsString(gradingScale))
                .withStatus(200)));
            
            List<Grade> grades = (List<Grade>) gsPair.getValue();
            for (Grade grade : grades) {
              stubFor(get(urlEqualTo(String.format("/1/common/gradingScales/%d/grades/%d", gradingScale.getId(), grade.getId())))
                .willReturn(aResponse()
                  .withHeader("Content-Type", "application/json")
                  .withBody(pyramusMocker.objectMapper.writeValueAsString(grade))
                  .withStatus(200)));
            }
            stubFor(get(urlEqualTo(String.format("/1/common/gradingScales/%d/grades", gradingScale.getId())))
              .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pyramusMocker.objectMapper.writeValueAsString(grades))
                .withStatus(200)));

        }
        return this;
      }
    
      public Builder mockStudents() throws Exception{

        List<Student> studentsList = new ArrayList<>();
        for (MockStudent mockStudent : pyramusMocker.students) {
          Student student = TestUtilities.studentFromMockStudent(mockStudent);
                
          stubFor(get(urlEqualTo(String.format("/1/students/students/%d", student.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pyramusMocker.objectMapper.writeValueAsString(student))
              .withStatus(200)));

          Email email = new Email(student.getId(), (long) 1, true, mockStudent.getEmail());
          Email[] emails = { email };
          
          stubFor(get(urlEqualTo(String.format("/1/students/students/%d/emails", student.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pyramusMocker.objectMapper.writeValueAsString(emails))
              .withStatus(200)));
          
          Student[] studentArray = { student };
          
          stubFor(get(urlEqualTo(String.format("/1/students/students?email=%s", mockStudent.getEmail())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pyramusMocker.objectMapper.writeValueAsString(studentArray))
              .withStatus(200)));
          
          stubFor(get(urlMatching(String.format("/1/persons/persons/%d/students", student.getPersonId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pyramusMocker.objectMapper.writeValueAsString(studentArray))
              .withStatus(200)));
          
          studentsList.add(student);
          pyramusMocker.payloads.add(pyramusMocker.objectMapper.writeValueAsString(new WebhookStudentCreatePayload(student.getId())));
        }
        
        stubFor(get(urlMatching("/1/students/students?filterArchived=false&firstResult=.*&maxResults=.*"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pyramusMocker.objectMapper.writeValueAsString(studentsList))
            .withStatus(200)));

        stubFor(get(urlEqualTo("/1/students/students"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pyramusMocker.objectMapper.writeValueAsString(studentsList))
            .withStatus(200)));
        
        return this;
      }
      
      public Builder mockPersons() throws Exception {
        for (Person person : pyramusMocker.persons) {
          stubFor(get(urlEqualTo("/1/persons/persons/" + person.getId()))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pyramusMocker.objectMapper.writeValueAsString(person))
              .withStatus(200)));
          pyramusMocker.payloads.add(pyramusMocker.objectMapper.writeValueAsString(new WebhookPersonCreatePayload(person.getId())));
        }
        
        stubFor(get(urlMatching("/1/persons/persons?filterArchived=.*"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pyramusMocker.objectMapper.writeValueAsString(pyramusMocker.persons))
            .withStatus(200)));

        stubFor(get(urlEqualTo("/1/persons/persons"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pyramusMocker.objectMapper.writeValueAsString(pyramusMocker.persons))
            .withStatus(200)));

        return this;
      }
      
      public Builder mockStudyProgrammes() throws JsonProcessingException {       
        stubFor(get(urlEqualTo("/1/students/studyProgrammes"))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pyramusMocker.objectMapper.writeValueAsString(pyramusMocker.studyProgrammes))
              .withStatus(200)));
        
        for (StudyProgramme sp : pyramusMocker.studyProgrammes) {
          stubFor(get(urlEqualTo(String.format("/1/students/studyProgrammes/%d", sp.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pyramusMocker.objectMapper.writeValueAsString(sp))
              .withStatus(200)));          
        }

        stubFor(get(urlEqualTo("/1/students/studyProgrammeCategories"))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pyramusMocker.objectMapper.writeValueAsString(pyramusMocker.studyProgrammeCategories))
              .withStatus(200)));
        
        for (StudyProgrammeCategory spc : pyramusMocker.studyProgrammeCategories) {
          stubFor(get(urlEqualTo(String.format("/1/students/studyProgrammeCategories/%d", spc.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pyramusMocker.objectMapper.writeValueAsString(spc))
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
            .withBody(pyramusMocker.objectMapper.writeValueAsString(contactType))
            .withStatus(200)));
        
        stubFor(get(urlEqualTo("/1/common/contactTypes"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pyramusMocker.objectMapper.writeValueAsString(contactTypes))
            .withStatus(200)));
        return this;
      }      
      
      public Builder mockStaffMembers() throws Exception {
        Map<String, String> variables = null;
        List<String> tags = null;
        List<StaffMember> staffs = new ArrayList<>();
        for (MockStaffMember mockStaffMember : pyramusMocker.staffMembers) {
          StaffMember staffMember = new StaffMember(mockStaffMember.getId(), mockStaffMember.getPersonId(), null, mockStaffMember.getFirstName(), mockStaffMember.getLastName(), null, mockStaffMember.getRole(), tags, variables);

          stubFor(get(urlEqualTo(String.format("/1/staff/members/%d", staffMember.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pyramusMocker.objectMapper.writeValueAsString(staffMember))
              .withStatus(200)));
          
          StaffMember[] staffMemberArray = { staffMember };
          
          stubFor(get(urlEqualTo(String.format("/1/staff/members?email=%s", mockStaffMember.getEmail())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pyramusMocker.objectMapper.writeValueAsString(staffMemberArray))
              .withStatus(200)));
          
          Email email = new Email(staffMember.getId(), 1l, true, mockStaffMember.getEmail());
          Email[] emails = { email };

          stubFor(get(urlEqualTo(String.format("/1/staff/members/%d/emails", staffMember.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pyramusMocker.objectMapper.writeValueAsString(emails))
              .withStatus(200)));
          
          stubFor(get(urlMatching(String.format("/1/persons/persons/%d/staffMembers", staffMember.getPersonId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(pyramusMocker.objectMapper.writeValueAsString(staffMemberArray))
              .withStatus(200)));
          
          staffs.add(staffMember);
          pyramusMocker.payloads.add(pyramusMocker.objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload(staffMember.getId())));
        }
        
        stubFor(get(urlEqualTo("/1/staff/members"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pyramusMocker.objectMapper.writeValueAsString(staffs))
            .withStatus(200)));
        
        return this;
      }
      
      public Builder mockCourseStaffMemberRoles() throws JsonProcessingException {
        
        CourseStaffMemberRole teacherRole = new CourseStaffMemberRole((long) 8, "Opettaja");
        CourseStaffMemberRole[] courseStaffMemberRoles = { teacherRole };

        stubFor(get(urlEqualTo("/1/courses/staffMemberRoles"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pyramusMocker.objectMapper.writeValueAsString(courseStaffMemberRoles))
            .withStatus(200)));
        
        for (CourseStaffMemberRole role : courseStaffMemberRoles) {
          stubFor(get(urlEqualTo(String.format("/1/courses/staffMemberRoles/%d", role.getId())))
              .willReturn(aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(pyramusMocker.objectMapper.writeValueAsString(role))
                .withStatus(200)));
        }
        return this;
      }
      
      public Builder mockLogin(MockLoggable loggable) throws JsonProcessingException {
        stubFor(get(urlEqualTo("/dnm")).willReturn(aResponse().withHeader("Content-Type", "application/json").withBody("").withStatus(204)));

        stubFor(get(urlMatching("/users/authorize.*"))
          .willReturn(aResponse()
            .withStatus(302)
            .withHeader("Location", String.format("http://%s:%s/login?_stg=rsp&code=1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111", System.getProperty("it.host"), System.getProperty("it.port.http")))));

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
            .withBody(pyramusMocker.objectMapper.writeValueAsString(whoAmI))
            .withStatus(200)));
        
        stubFor(get(urlEqualTo(String.format("/users/logout.page?redirectUrl=https://%s:%s", System.getProperty("it.host"), System.getProperty("it.port.https"))))
          .willReturn(aResponse()
            .withStatus(302)
            .withHeader("Location", String.format("http://%s:%s/", System.getProperty("it.host"), System.getProperty("it.port.http")))));
        
        return this;
      }
      
      public Builder addGrade(GradingScale gradingScale, Grade grade){
        List<Grade> grades = new ArrayList<>();
        if(pyramusMocker.gradingScales.containsKey(gradingScale)) {
          grades = pyramusMocker.gradingScales.get(gradingScale);
          grades.add(grade);
          pyramusMocker.gradingScales.put(gradingScale, grades);
        }else{
          grades.add(grade);
          pyramusMocker.gradingScales.put(gradingScale, grades);
        }
        return this;
      }
      
      public Builder addEducationalTimeUnit(EducationalTimeUnit educationalTimeUnit) {
        pyramusMocker.educationalTimeUnits.add(educationalTimeUnit);
        return this;
      }
      
      public Builder addEducationType(EducationType educationType) {
        pyramusMocker.educationTypes.add(educationType);
        return this;
      }
      
      public Builder addSubject(Subject subject) {
        pyramusMocker.subjects.add(subject);
        return this;
      }

      public Builder addStudyProgrammeCategory(StudyProgrammeCategory studyProgrammeCategory) {
        pyramusMocker.studyProgrammeCategories.add(studyProgrammeCategory);
        return this;
      }
      
      public Builder addStudyProgramme(StudyProgramme studyProgramme) {
        pyramusMocker.studyProgrammes.add(studyProgramme);
        return this;
      }
      
      public Builder addCourseType(CourseType courseType){
        pyramusMocker.courseTypes.add(courseType);
        return this;
      }
      
      public PyramusMock build() throws Exception {
        
        mockPersons();
        mockStudents();
        mockStaffMembers();

        mockContactTypes();
        mockStudyProgrammes();
        mockGradesAndScales();
        mockEducationalTimeUnits();
        mockEducationTypes();
        mockSubjects();
        mockCourseTypes();
        mockCourseStudents();
        mockCourseStaffMemberRoles();
        mockCourseStaffMembers();
        
        for(String payload : pyramusMocker.payloads) {
          TestUtilities.webhookCall(String.format("http://%s:%s/pyramus/webhook", System.getProperty("it.host"), System.getProperty("it.port.http")), payload);
        }
        
        return pyramusMocker;
      }
      
      public Builder reset() {
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

  public Map<GradingScale, List<Grade>> getGradingScales() {
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

  public Map<Long, List<CourseStudent>> getCourseStudents() {
    return courseStudents;
  }

  public Map<Long, List<CourseStaffMember>> getCourseStaffMembers() {
    return courseStaffMembers;
  }

  private List<MockStudent> students = new ArrayList<>();
  private List<MockStaffMember> staffMembers = new ArrayList<>();
  private List<Person> persons = new ArrayList<>();
  private ObjectMapper objectMapper;
  private Map<GradingScale, List<Grade>> gradingScales = new HashMap<>();
  private List<EducationalTimeUnit> educationalTimeUnits = new ArrayList<>();
  private List<EducationType> educationTypes = new ArrayList<>();
  private List<Subject> subjects = new ArrayList<>();
  private List<StudyProgrammeCategory> studyProgrammeCategories = new ArrayList<>();
  private List<StudyProgramme> studyProgrammes = new ArrayList<>();
  private List<CourseType> courseTypes = new ArrayList<>();
  private Map<Long, List<CourseStudent>> courseStudents = new HashMap<>();
  private Map<Long, List<CourseStaffMember>> courseStaffMembers = new HashMap<>();
  private List<String> payloads = new ArrayList<>();
  
}