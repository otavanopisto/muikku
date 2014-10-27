package fi.muikku.schooldata.initializers;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.grading.GradingScaleEntityDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.grading.GradingScaleEntity;
import fi.muikku.schooldata.entity.GradingScale;

@Stateless
@Dependent
public class GradingScaleSchoolDataEntityInitializer implements SchoolDataGradingScaleInitializer {

  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;

  @Inject
  private GradingScaleEntityDAO gradingScaleEntityDAO;

  @Override
  public List<GradingScale> init(List<GradingScale> gradingScales) {
    List<GradingScale> result = new ArrayList<>();

    for (GradingScale gradingScale : gradingScales) {
      gradingScale = init(gradingScale);
      if (gradingScale != null) {
        result.add(gradingScale);
      }
    }

    return result;
  }

  private GradingScale init(GradingScale gradingScale) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(gradingScale.getSchoolDataSource());
    GradingScaleEntity gradingScaleEntity = gradingScaleEntityDAO.findByDataSourceAndIdentifier(dataSource, gradingScale.getIdentifier());
    if (gradingScaleEntity == null) {
      gradingScaleEntityDAO.create(dataSource, gradingScale.getIdentifier(), Boolean.FALSE);
    }

    return gradingScale;
  }

  @Override
  public int getPriority() {
    return SchoolDataEntityInitializer.PRIORITY_HIGHEST;
  }

}
