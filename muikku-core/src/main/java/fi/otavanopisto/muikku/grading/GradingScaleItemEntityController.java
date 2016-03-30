package fi.otavanopisto.muikku.grading;

import java.util.logging.Logger;

import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.base.SchoolDataSourceDAO;
import fi.otavanopisto.muikku.dao.grading.GradingScaleItemEntityDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.grading.GradingScaleEntity;
import fi.otavanopisto.muikku.model.grading.GradingScaleItemEntity;

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
