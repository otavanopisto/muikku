package fi.otavanopisto.muikku.plugins.schooldatapyramus;

import java.util.Arrays;
import java.util.List;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusMatriculationExam;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusMatriculationExamEnrollment;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.PyramusClient;
import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.MatriculationSchoolDataBridge;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeException;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationEligibilities;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExam;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamAttendance;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollment;

@Dependent
public class PyramusMatriculationSchoolDataBridge implements MatriculationSchoolDataBridge {

  @Inject
  private PyramusClient pyramusClient;
  
  @Inject
  private PyramusIdentifierMapper pyramusIdentifierMapper;

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

  @Override
  public List<MatriculationExam> listMatriculationExams(boolean onlyEligible) {
    PyramusMatriculationExam[] exams = pyramusClient.get(
        String.format("/matriculation/exams?onlyEligible=%s", onlyEligible), PyramusMatriculationExam[].class);
    return Arrays.asList(exams);
  }

  @Override
  public MatriculationExamEnrollment createMatriculationExamEnrollment() {
    return new PyramusMatriculationExamEnrollment();
  }

  @Override
  public void submitMatriculationExamEnrollment(Long examId,
      MatriculationExamEnrollment enrollment) {
    pyramusClient.post(String.format("/matriculation/exams/%d/enrollments", examId), enrollment);
  }

  @Override
  public MatriculationExamAttendance createMatriculationExamAttendance() {
    return new MatriculationExamAttendance();
  }

  @Override
  public Long getStudentId(SchoolDataIdentifier studentIdentifier) {
    if (!getSchoolDataSource().equals(studentIdentifier.getDataSource())) {
      throw new SchoolDataBridgeException("Invalid data source");
    }
    String identifier = studentIdentifier.getIdentifier();
    return pyramusIdentifierMapper.getPyramusStudentId(identifier);
  }

  @Override
  public BridgeResponse<MatriculationEligibilities> listEligibilities(SchoolDataIdentifier studentIdentifier) {
    if (studentIdentifier == null) {
      throw new IllegalArgumentException();
    }
    
    Long pyramusStudentId = pyramusIdentifierMapper.getPyramusStudentId(studentIdentifier.getIdentifier());
    if (pyramusStudentId == null) {
      throw new IllegalArgumentException();
    }
    
    return pyramusClient.responseGet(String.format("/matriculation/students/%d/eligibility", pyramusStudentId), MatriculationEligibilities.class);
  }

}
