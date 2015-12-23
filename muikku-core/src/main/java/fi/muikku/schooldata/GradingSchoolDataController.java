package fi.muikku.schooldata;

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

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.schooldata.entity.GradingScale;
import fi.muikku.schooldata.entity.GradingScaleItem;
import fi.muikku.schooldata.entity.WorkspaceAssessment;
import fi.muikku.schooldata.entity.WorkspaceAssessmentRequest;

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
      try {
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
      } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while create a workspace assessment", e);
      }
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + dataSource.getIdentifier());
    }
  
    return null;
  }
  
  public WorkspaceAssessment findWorkspaceAssessment(SchoolDataSource schoolDataSource, String identifier, String workspaceIdentifier, String studentIdentifier) {
    GradingSchoolDataBridge schoolDataBridge = getGradingBridge(schoolDataSource);
    if (schoolDataBridge != null) {
      try {
        return schoolDataBridge.findWorkspaceAssessment(identifier, workspaceIdentifier, studentIdentifier);
      } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while finding a workspace assessment", e);
      }
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + schoolDataSource.getIdentifier());
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
      try {
        return schoolDataBridge.listWorkspaceAssessments(workspaceIdentifier, studentIdentifier);
      } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while listing workspace assessments", e);
      }
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + schoolDataSource.getIdentifier());
    }
  
    return null;
  }
  
  public WorkspaceAssessment updateWorkspaceAssessment(String schoolDataSource, String identifier, String workspaceUserIdentifier, String workspaceUserSchoolDataSource, String workspaceIdentifier, String studentIdentifier, String assessingUserIdentifier, String assessingUserSchoolDataSource, String gradeIdentifier, String gradeSchoolDataSource, String gradingScaleIdentifier, String gradingScaleSchoolDataSource, String verbalAssessment, Date date) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    GradingSchoolDataBridge schoolDataBridge = getGradingBridge(dataSource);
    if (schoolDataBridge != null) {
      try {
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
      } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while updating a workspace assessment", e);
      }
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + dataSource.getIdentifier());
    }
  
    return null;
  }
	
	/* GradingScales */
	
	public GradingScale findGradingScale(SchoolDataSource schoolDataSource, String identifier) {
		GradingSchoolDataBridge schoolDataBridge = getGradingBridge(schoolDataSource);
		if (schoolDataBridge != null) {
			try {
				return schoolDataBridge.findGradingScale(identifier);
			} catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
				logger.log(Level.SEVERE, "School Data Bridge reported a problem while findin a grading scale", e);
			}
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
			} catch (UnexpectedSchoolDataBridgeException e) {
				logger.log(Level.SEVERE, "School Data Bridge reported a problem while listing grading scales", e);
			}
		}
		
		return result;
	}
	
	/* GradingScaleItems */
	
	public GradingScaleItem findGradingScaleItem(SchoolDataSource schoolDataSource, GradingScale gradingScale, String identifier) {
		GradingSchoolDataBridge schoolDataBridge = getGradingBridge(schoolDataSource);
		if (schoolDataBridge != null) {
			try {
				return schoolDataBridge.findGradingScaleItem(gradingScale.getIdentifier(), identifier);
			} catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
				logger.log(Level.SEVERE, "School Data Bridge reported a problem while findin a grading scale item", e);
			}
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
				try {
					return schoolDataBridge.listGradingScaleItems(gradingScale.getIdentifier());
				} catch (UnexpectedSchoolDataBridgeException e) {
					logger.log(Level.SEVERE, "School Data Bridge reported a problem while listing grading scale items", e);
				} catch (SchoolDataBridgeRequestException e) {
					logger.log(Level.SEVERE, "School Data Bridge reported a problem while listing grading scale items", e);
				}
			} else {
				logger.log(Level.SEVERE, "School Data Bridge not found: " + schoolDataSource.getIdentifier());
			}
		}

		return null;
	}
	
  public WorkspaceAssessmentRequest createWorkspaceAssessmentRequest(String schoolDataSource, String workspaceUserIdentifier, String workspaceUserSchoolDataSource, String workspaceIdentifier,
      String studentIdentifier, String requestText, Date date) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    GradingSchoolDataBridge schoolDataBridge = getGradingBridge(dataSource);
    if (schoolDataBridge != null) {
      try {
        return schoolDataBridge.createWorkspaceAssessmentRequest(
            workspaceUserIdentifier,
            workspaceUserSchoolDataSource,
            workspaceIdentifier,
            studentIdentifier,
            requestText, 
            date);
      } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while create a workspace assessment", e);
      }
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + dataSource.getIdentifier());
    }
  
    return null;
  }

  public WorkspaceAssessmentRequest findWorkspaceAssessmentRequest(String schoolDataSource, String identifier, String workspaceIdentifier, String studentIdentifier)
      throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    GradingSchoolDataBridge schoolDataBridge = getGradingBridge(dataSource);
    if (schoolDataBridge != null) {
      try {
        return schoolDataBridge.findWorkspaceAssessmentRequest(identifier, workspaceIdentifier, studentIdentifier);
      } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while finding a workspace assessment", e);
      }
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + dataSource.getIdentifier());
    }
  
    return null;
  }

  public List<WorkspaceAssessmentRequest> listWorkspaceAssessmentRequests(String schoolDataSource, String workspaceIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    GradingSchoolDataBridge schoolDataBridge = getGradingBridge(dataSource);
    if (schoolDataBridge != null) {
      try {
        return schoolDataBridge.listWorkspaceAssessmentRequests(workspaceIdentifier);
      } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while listing workspace assessments", e);
      }
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + dataSource.getIdentifier());
    }
  
    return null;
  }

  public List<WorkspaceAssessmentRequest> listWorkspaceAssessmentRequests(String schoolDataSource, String workspaceIdentifier, String studentIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    GradingSchoolDataBridge schoolDataBridge = getGradingBridge(dataSource);
    if (schoolDataBridge != null) {
      try {
        return schoolDataBridge.listWorkspaceAssessmentRequests(workspaceIdentifier, studentIdentifier);
      } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while listing workspace assessments", e);
      }
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + dataSource.getIdentifier());
    }
  
    return null;
  }

  public List<WorkspaceAssessmentRequest> listAssessmentRequestsByStudent(String schoolDataSource, String studentIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    GradingSchoolDataBridge schoolDataBridge = getGradingBridge(dataSource);
    if (schoolDataBridge != null) {
      try {
        return schoolDataBridge.listAssessmentRequestsByStudent(studentIdentifier);
      } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while listing student assessment requests", e);
      }
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + dataSource.getIdentifier());
    }
  
    return null;
  }

  public WorkspaceAssessmentRequest updateWorkspaceAssessmentRequest(String schoolDataSource, String identifier, String workspaceUserIdentifier, String workspaceUserSchoolDataSource,
      String workspaceIdentifier, String studentIdentifier, String requestText, Date date) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    GradingSchoolDataBridge schoolDataBridge = getGradingBridge(dataSource);
    if (schoolDataBridge != null) {
      try {
        return schoolDataBridge.updateWorkspaceAssessmentRequest(
            identifier,
            workspaceUserIdentifier,
            workspaceUserSchoolDataSource,
            workspaceIdentifier,
            studentIdentifier,
            requestText, 
            date);
      } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while updating a workspace assessment request", e);
      }
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + dataSource.getIdentifier());
    }
  
    return null;
  }

  public void deleteWorkspaceAssessmentRequest(String schoolDataSource, String identifier, String workspaceIdentifier, String studentIdentifier) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    GradingSchoolDataBridge schoolDataBridge = getGradingBridge(dataSource);
    if (schoolDataBridge != null) {
      try {
        schoolDataBridge.deleteWorkspaceAssessmentRequest(identifier, workspaceIdentifier, studentIdentifier);
      } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while updating a workspace assessment request", e);
      }
    } else {
      logger.log(Level.SEVERE, "School Data Bridge could not be found for data source: "  + dataSource.getIdentifier());
    }
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
