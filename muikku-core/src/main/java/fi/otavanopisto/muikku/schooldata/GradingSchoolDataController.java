package fi.otavanopisto.muikku.schooldata;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.base.SchoolDataSourceDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.schooldata.entity.GradingScale;
import fi.otavanopisto.muikku.schooldata.entity.GradingScaleItem;
import fi.otavanopisto.muikku.schooldata.entity.TransferCredit;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentRequest;

class GradingSchoolDataController { 
  
  // TODO: Caching 
  // TODO: Events
  
  @Inject
  private Logger logger;
  
  @Inject
  @Any
  private Instance<GradingSchoolDataBridge> gradingBridges;

  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;
  
  /* WorkspaceAssessment */
  
  public WorkspaceAssessment createWorkspaceAssessment(String schoolDataSource, String workspaceUserIdentifier, String workspaceUserSchoolDataSource, String workspaceIdentifier, String studentIdentifier, String assessingUserIdentifier, String assessingUserSchoolDataSource, String gradeIdentifier, String gradeSchoolDataSource, String gradingScaleIdentifier, String gradingScaleSchoolDataSource, String verbalAssessment, Date date) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    GradingSchoolDataBridge schoolDataBridge = getGradingBridge(dataSource);
    if (schoolDataBridge != null) {
      return schoolDataBridge.createWorkspaceAssessment(
          workspaceUserIdentifier,
          workspaceUserSchoolDataSource,
          workspaceIdentifier,
          studentIdentifier,
          assessingUserIdentifier, 
          assessingUserSchoolDataSource, 
          gradeIdentifier, 
          gradeSchoolDataSource,
          gradingScaleIdentifier, 
          gradingScaleSchoolDataSource,
          verbalAssessment, 
          date);
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + dataSource.getIdentifier());
    }
  
    return null;
  }
  
  public WorkspaceAssessment findWorkspaceAssessment(SchoolDataIdentifier workspaceIdentifier, SchoolDataIdentifier studentIdentifier,
      SchoolDataIdentifier workspaceAssesmentIdentifier) {
    GradingSchoolDataBridge schoolDataBridge = getGradingBridge(workspaceAssesmentIdentifier.getDataSource());
    if (schoolDataBridge != null) {
      return schoolDataBridge.findWorkspaceAssessment(workspaceAssesmentIdentifier.getIdentifier(), workspaceIdentifier.getIdentifier(), studentIdentifier.getIdentifier());
    } else {
      logger.log(Level.SEVERE, String.format("School Data Bridge could not be found for data source: %s", workspaceAssesmentIdentifier.getDataSource()));
    }
  
    return null;
  }

  public List<WorkspaceAssessment> listWorkspaceAssessments(String schoolDataSource, String workspaceIdentifier, String studentIdentifier) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    if (dataSource == null) {
      logger.severe(String.format("Could not find school data source %s", schoolDataSource));
      return null;
    }
    
    return listWorkspaceAssessments(dataSource, workspaceIdentifier, studentIdentifier);
  }
  
  public List<WorkspaceAssessment> listWorkspaceAssessments(SchoolDataSource schoolDataSource, String workspaceIdentifier, String studentIdentifier) {
    GradingSchoolDataBridge schoolDataBridge = getGradingBridge(schoolDataSource);
    if (schoolDataBridge != null) {
      return schoolDataBridge.listWorkspaceAssessments(workspaceIdentifier, studentIdentifier);
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + schoolDataSource.getIdentifier());
    }
  
    return null;
  }
  
  public WorkspaceAssessment updateWorkspaceAssessment(String schoolDataSource, String identifier, String workspaceUserIdentifier, String workspaceUserSchoolDataSource, String workspaceIdentifier, String studentIdentifier, String assessingUserIdentifier, String assessingUserSchoolDataSource, String gradeIdentifier, String gradeSchoolDataSource, String gradingScaleIdentifier, String gradingScaleSchoolDataSource, String verbalAssessment, Date date) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    GradingSchoolDataBridge schoolDataBridge = getGradingBridge(dataSource);
    if (schoolDataBridge != null) {
      return schoolDataBridge.updateWorkspaceAssessment(
          identifier,
          workspaceUserIdentifier,
          workspaceUserSchoolDataSource,
          workspaceIdentifier,
          studentIdentifier,
          assessingUserIdentifier, 
          assessingUserSchoolDataSource, 
          gradeIdentifier, 
          gradeSchoolDataSource,
          gradingScaleIdentifier,
          gradingScaleSchoolDataSource,
          verbalAssessment, 
          date);
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + dataSource.getIdentifier());
    }
  
    return null;
  }

  public void deleteWorkspaceAssessment(SchoolDataIdentifier workspaceIdentifier,
      SchoolDataIdentifier studentIdentifier, SchoolDataIdentifier workspaceAssesmentIdentifier) {
    
    GradingSchoolDataBridge schoolDataBridge = getGradingBridge(workspaceAssesmentIdentifier.getDataSource());
    if (schoolDataBridge != null) {
      schoolDataBridge.deleteWorkspaceAssessment(workspaceIdentifier, studentIdentifier, workspaceAssesmentIdentifier);
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + workspaceAssesmentIdentifier.getDataSource());
    }
  }
  
  /* TransferCredits */

  public List<TransferCredit> listStudentTransferCredits(SchoolDataIdentifier studentIdentifier) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(studentIdentifier.getDataSource());
    if (dataSource == null) {
      logger.severe(String.format("Could not find school data source %s", studentIdentifier.getDataSource()));
      return Collections.emptyList();
    }
    
    return listStudentTransferCredits(dataSource, studentIdentifier);
  }
  
  private List<TransferCredit> listStudentTransferCredits(SchoolDataSource schoolDataSource, SchoolDataIdentifier studentIdentifier) {
    GradingSchoolDataBridge schoolDataBridge = getGradingBridge(schoolDataSource);
    if (schoolDataBridge != null) {
      return schoolDataBridge.listStudentTransferCredits(studentIdentifier);
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + schoolDataSource.getIdentifier());
    }
  
    return Collections.emptyList();
  }
  
  /* GradingScales */
  
  public GradingScale findGradingScale(SchoolDataSource schoolDataSource, String identifier) {
    GradingSchoolDataBridge schoolDataBridge = getGradingBridge(schoolDataSource);
    if (schoolDataBridge != null) {
      return schoolDataBridge.findGradingScale(identifier);
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + schoolDataSource.getIdentifier());
    }
  
    return null;
  }

  public GradingScale findGradingScale(String schoolDataSource, String identifier) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    if (dataSource != null) {
       return findGradingScale(dataSource, identifier);
    } else {
      logger.log(Level.SEVERE, "School Data Source could not be found by identifier:  " + schoolDataSource);
    }

    return null;
  }
  
  public List<GradingScale> listGradingScales() {
    // TODO: This method WILL cause performance problems, replace with something more sensible 
    
    List<GradingScale> result = new ArrayList<>();
    
    for (GradingSchoolDataBridge gradingBridge : getGradingBridges()) {
      try {
        result.addAll(gradingBridge.listGradingScales());
      } catch (SchoolDataBridgeInternalException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while listing grading scales", e);
      }
    }
    
    return result;
  }
  
  /* GradingScaleItems */
  
  public GradingScaleItem findGradingScaleItem(SchoolDataSource schoolDataSource, GradingScale gradingScale, String identifier) {
    GradingSchoolDataBridge schoolDataBridge = getGradingBridge(schoolDataSource);
    if (schoolDataBridge != null) {
      return schoolDataBridge.findGradingScaleItem(gradingScale.getIdentifier(), identifier);
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + schoolDataSource.getIdentifier());
    }
  
    return null;
  }

  public GradingScaleItem findGradingScaleItem(String schoolDataSource, GradingScale gradingScale, String identifier) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    if (dataSource != null) {
       return findGradingScaleItem(dataSource, gradingScale, identifier);
    } else {
      logger.log(Level.SEVERE, "School Data Source could not be found by identifier:  " + schoolDataSource);
    }

    return null;
  }
  
  public List<GradingScaleItem> listGradingScaleItems(GradingScale gradingScale) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(gradingScale.getSchoolDataSource());
    if (schoolDataSource != null) {
      GradingSchoolDataBridge schoolDataBridge = getGradingBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        return schoolDataBridge.listGradingScaleItems(gradingScale.getIdentifier());
      } else {
        logger.log(Level.SEVERE, "School Data Bridge not found: " + schoolDataSource.getIdentifier());
      }
    }

    return null;
  }
  
  public WorkspaceAssessmentRequest createWorkspaceAssessmentRequest(String schoolDataSource, String workspaceUserIdentifier, String workspaceUserSchoolDataSource, String workspaceIdentifier,
      String studentIdentifier, String requestText, Date date) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    GradingSchoolDataBridge schoolDataBridge = getGradingBridge(dataSource);
    if (schoolDataBridge != null) {
      return schoolDataBridge.createWorkspaceAssessmentRequest(
          workspaceUserIdentifier,
          workspaceUserSchoolDataSource,
          workspaceIdentifier,
          studentIdentifier,
          requestText, 
          date);
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + dataSource.getIdentifier());
    }
  
    return null;
  }

  public WorkspaceAssessmentRequest findWorkspaceAssessmentRequest(String schoolDataSource, String identifier, String workspaceIdentifier, String studentIdentifier) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    GradingSchoolDataBridge schoolDataBridge = getGradingBridge(dataSource);
    if (schoolDataBridge != null) {
      return schoolDataBridge.findWorkspaceAssessmentRequest(identifier, workspaceIdentifier, studentIdentifier);
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + dataSource.getIdentifier());
    }
  
    return null;
  }

  public List<WorkspaceAssessmentRequest> listWorkspaceAssessmentRequests(String schoolDataSource, String workspaceIdentifier) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    GradingSchoolDataBridge schoolDataBridge = getGradingBridge(dataSource);
    if (schoolDataBridge != null) {
      return schoolDataBridge.listWorkspaceAssessmentRequests(workspaceIdentifier);
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + dataSource.getIdentifier());
    }
  
    return null;
  }

  public List<WorkspaceAssessmentRequest> listWorkspaceAssessmentRequests(String schoolDataSource, String workspaceIdentifier, String studentIdentifier) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    GradingSchoolDataBridge schoolDataBridge = getGradingBridge(dataSource);
    if (schoolDataBridge != null) {
      return schoolDataBridge.listWorkspaceAssessmentRequests(workspaceIdentifier, studentIdentifier);
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + dataSource.getIdentifier());
    }
  
    return null;
  }

  public List<WorkspaceAssessmentRequest> listAssessmentRequestsByStudent(String schoolDataSource, String studentIdentifier) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    GradingSchoolDataBridge schoolDataBridge = getGradingBridge(dataSource);
    if (schoolDataBridge != null) {
      return schoolDataBridge.listAssessmentRequestsByStudent(studentIdentifier);
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + dataSource.getIdentifier());
    }
  
    return null;
  }

  public WorkspaceAssessmentRequest updateWorkspaceAssessmentRequest(String schoolDataSource, String identifier, String workspaceUserIdentifier, String workspaceUserSchoolDataSource,
      String workspaceIdentifier, String studentIdentifier, String requestText, Date date) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    GradingSchoolDataBridge schoolDataBridge = getGradingBridge(dataSource);
    if (schoolDataBridge != null) {
      return schoolDataBridge.updateWorkspaceAssessmentRequest(
          identifier,
          workspaceUserIdentifier,
          workspaceUserSchoolDataSource,
          workspaceIdentifier,
          studentIdentifier,
          requestText, 
          date);
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + dataSource.getIdentifier());
    }
  
    return null;
  }

  public void deleteWorkspaceAssessmentRequest(String schoolDataSource, String identifier, String workspaceIdentifier, String studentIdentifier) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    GradingSchoolDataBridge schoolDataBridge = getGradingBridge(dataSource);
    if (schoolDataBridge != null) {
      schoolDataBridge.deleteWorkspaceAssessmentRequest(identifier, workspaceIdentifier, studentIdentifier);
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + dataSource.getIdentifier());
    }
  }
  
  private GradingSchoolDataBridge getGradingBridge(String schoolDataSource) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    if (dataSource == null) {
      logger.log(Level.SEVERE, String.format("Could not find GradingSchoolDataBridge for data source %s", schoolDataSource));
      return null;
    }
    
    return getGradingBridge(dataSource);
  } 

  private GradingSchoolDataBridge getGradingBridge(SchoolDataSource schoolDataSource) {
    Iterator<GradingSchoolDataBridge> iterator = gradingBridges.iterator();
    while (iterator.hasNext()) {
      GradingSchoolDataBridge gradingSchoolDataBridge = iterator.next();
      if (gradingSchoolDataBridge.getSchoolDataSource().equals(schoolDataSource.getIdentifier())) {
        return gradingSchoolDataBridge;
      }
    }
    
    return null;
  }
  
  private List<GradingSchoolDataBridge> getGradingBridges() {
    List<GradingSchoolDataBridge> result = new ArrayList<>();
    
    Iterator<GradingSchoolDataBridge> iterator = gradingBridges.iterator();
    while (iterator.hasNext()) {
      result.add(iterator.next());
    }
    
    return Collections.unmodifiableList(result);
  }

}
