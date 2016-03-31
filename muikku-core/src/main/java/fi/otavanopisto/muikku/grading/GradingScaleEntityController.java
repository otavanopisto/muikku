package fi.otavanopisto.muikku.grading;

import java.util.logging.Logger;

import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.base.SchoolDataSourceDAO;
import fi.otavanopisto.muikku.dao.grading.GradingScaleEntityDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.grading.GradingScaleEntity;

public class GradingScaleEntityController {
  
  @Inject
  private Logger logger;

  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;

  @Inject
  private GradingScaleEntityDAO gradingScaleEntityDAO;
  
  public GradingScaleEntity createGradingScaleEntity(String dataSource, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (dataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return gradingScaleEntityDAO.create(schoolDataSource, identifier, Boolean.FALSE);
  }
  
  public GradingScaleEntity findGradingScaleEntityBySchoolDataSourceAndIdentifier(String dataSource, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (dataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return gradingScaleEntityDAO.findByDataSourceAndIdentifier(schoolDataSource, identifier);
  }
  
  
}
