package fi.muikku.mock;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.github.tomakehurst.wiremock.client.WireMock.urlMatching;

import java.util.List;
import java.util.Map;

import org.joda.time.DateTime;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;

import fi.muikku.mock.model.MockStaffMember;
import fi.muikku.mock.model.MockStudent;

import fi.pyramus.rest.model.Email;
import fi.pyramus.rest.model.Person;
import fi.pyramus.rest.model.StaffMember;
import fi.pyramus.rest.model.Student;

public class PyramusMock {
  private List<MockStudent> students;
  private List<MockStaffMember> staffMembers;
  private List<Person> persons;
  private ObjectMapper objectMapper;

  private PyramusMock() {
      // Prevent direct use
  }

  public static Builder mocker() {
      return new PyramusMock.Builder();
  }

  public static class Builder {
      private PyramusMock pmock = new PyramusMock();

      public Builder() {
      }

      public Builder students(List<MockStudent> students) {
        pmock.students = students;
        return this;
      }

      public Builder staffMembers(List<MockStaffMember> staffMembers) {
        pmock.staffMembers = staffMembers;
        return this;
      }

      public Builder addStudent(MockStudent mockStudent) {
        Person person = new Person(mockStudent.getPersonId(), mockStudent.getBirthday(), mockStudent.getSocialSecurityNumber(), mockStudent.getSex(), false, "empty", mockStudent.getPersonId());
        pmock.persons.add(person);
        pmock.students.add(mockStudent);
        return this;
      }
      
//      public Builder addCourseStudent(MockStudent mockStudent, MockCourse courset) {
//        
//      }
      
      public Builder addStaffMember(MockStaffMember mockStaffMember) {
        DateTime birthday = new DateTime(1990, 2, 2, 0, 0, 0, 0);
        Person person = new Person(mockStaffMember.getPersonId(), birthday, mockStaffMember.getSocialSecurityNumber(), mockStaffMember.getSex(), false, "empty", mockStaffMember.getPersonId());
        pmock.persons.add(person);
        pmock.staffMembers.add(mockStaffMember);
        return this;
      }
      
      public PyramusMock build() throws JsonProcessingException {
        pmock.objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        
        for (Person person : pmock.persons) {
          mockPerson(person);
        }
        for (MockStudent mockStudent : pmock.students) {
          mockStudent(mockStudent);
        }
        for (MockStaffMember mockStaffMember : pmock.staffMembers) {
          mockStaffMember(mockStaffMember);
        }
        mockPersons();

        return pmock;
      }
      private void mockStudent(MockStudent mockStudent) throws JsonProcessingException{
        Map<String, String> variables = null;
        List<String> tags = null;
        
        Student student = new Student(mockStudent.getId(), mockStudent.getPersonId(), mockStudent.getFirstName(), mockStudent.getLastName(), 
          null, null, null, null, null, null, null, null,
          null, null, null, mockStudent.getStudyProgrammeId(), null, null,
          false, null, null, null, null, variables, tags, false);
              
        stubFor(get(urlEqualTo(String.format("/1/students/students/%d", student.getId())))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(student))
            .withStatus(200)));

        Email email = new Email(student.getId(), (long) 1, true, mockStudent.getEmail());
        Email[] emails = {email};
        
        stubFor(get(urlEqualTo("/1/students/students/1/emails"))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(emails))
            .withStatus(200)));
        
        Student[] studentArray = { student };
        
        stubFor(get(urlEqualTo(String.format("/1/students/students?%s", mockStudent.getEmail())))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(pmock.objectMapper.writeValueAsString(studentArray))
            .withStatus(200)));
        
      }
      
      private void mockPerson(Person person) throws JsonProcessingException {
        String personJson = pmock.objectMapper.writeValueAsString(person);
        
        stubFor(get(urlEqualTo("/1/persons/persons/" + person.getId()))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(personJson)
            .withStatus(200)));
      }
      
      private void mockPersons() throws JsonProcessingException {
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
      }

      private void mockStaffMember(MockStaffMember mockStaffMember) throws JsonProcessingException {
        Map<String, String> variables = null;
        List<String> tags = null;
        StaffMember staffMember = new StaffMember(mockStaffMember.getId(), mockStaffMember.getPersonId(), null, mockStaffMember.getFirstName(), mockStaffMember.getLastName(), null, mockStaffMember.getRole(), tags, variables);

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

}