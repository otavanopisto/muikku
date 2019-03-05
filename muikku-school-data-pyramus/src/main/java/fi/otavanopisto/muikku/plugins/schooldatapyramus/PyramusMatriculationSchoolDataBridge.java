package fi.otavanopisto.muikku.plugins.schooldatapyramus;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusMatriculationExam;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.entities.PyramusMatriculationExamEnrollment;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.PyramusClient;
import fi.otavanopisto.muikku.schooldata.MatriculationSchoolDataBridge;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeException;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
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
  public MatriculationExam getMatriculationExam() {
    MatriculationExam exam = pyramusClient.get(
      "/matriculation/currentExam", PyramusMatriculationExam.class);
    return exam;
  }

  @Override
  public MatriculationExamEnrollment createMatriculationExamEnrollment() {
    return new PyramusMatriculationExamEnrollment();
  }

  @Override
  public void submitMatriculationExamEnrollment(
      MatriculationExamEnrollment enrollment) {
    pyramusClient.post("/matriculation/enrollments", enrollment);
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

}
