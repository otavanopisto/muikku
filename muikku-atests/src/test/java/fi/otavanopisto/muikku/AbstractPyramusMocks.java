package fi.otavanopisto.muikku;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlMatching;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;

import fi.pyramus.rest.model.StaffMember;
import fi.pyramus.rest.model.Student;

public class AbstractPyramusMocks {

  protected static void mockPersonStudens(Student[] students) throws JsonProcessingException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    Map<Long, List<Student>> personStudents = new HashMap<>();
    
    for (Student student : students) {
      if (!personStudents.containsKey(student.getPersonId())) {
        personStudents.put(student.getPersonId(), new ArrayList<Student>());
      }
      
      personStudents.get(student.getPersonId()).add(student);
    }
    
    for (Long personId : personStudents.keySet()) {
      stubFor(get(urlMatching(String.format("/1/persons/persons/%d/students", personId)))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(objectMapper.writeValueAsString(personStudents.get(personId)))
            .withStatus(200)));
    }
  }

  protected static void mockPersonStaffMembers(StaffMember[] staffMembers) throws JsonProcessingException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    Map<Long, List<StaffMember>> personStaffMembers = new HashMap<>();
    
    for (StaffMember staffMember : staffMembers) {
      if (!personStaffMembers.containsKey(staffMember.getPersonId())) {
        personStaffMembers.put(staffMember.getPersonId(), new ArrayList<StaffMember>());
      }
      
      personStaffMembers.get(staffMember.getPersonId()).add(staffMember);
    }
    
    for (Long personId : personStaffMembers.keySet()) {
      stubFor(get(urlMatching(String.format("/1/persons/persons/%d/staffMembers", personId)))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(objectMapper.writeValueAsString(personStaffMembers.get(personId)))
            .withStatus(200)));
    }
    
  }
  
}
