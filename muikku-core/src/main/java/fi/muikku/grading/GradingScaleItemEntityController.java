package fi.muikku.grading;

import java.util.logging.Logger;

import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.grading.GradingScaleItemEntityDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.grading.GradingScaleEntity;
import fi.muikku.model.grading.GradingScaleItemEntity;

public class GradingScaleItemEntityController {
  
  @Inject
  private Logger logger;

  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;

  @Inject
  private GradingScaleItemEntityDAO gradingScaleItemEntityDAO;
  
  public GradingScaleItemEntity createGradingScaleEntity(GradingScaleEntity gradingScaleEntity, String dataSource, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (dataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    // TODO: Shouldn't grading scale item contain information in which scale it belong to?
    
    return gradingScaleItemEntityDAO.create(schoolDataSource, identifier, Boolean.FALSE);
  }
  
  public GradingScaleItemEntity findGradingScaleItemEntityBySchoolDataSourceAndIdentifier(String dataSource, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (dataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return gradingScaleItemEntityDAO.findByDataSourceAndIdentifier(schoolDataSource, identifier);
  }
  
  
}
