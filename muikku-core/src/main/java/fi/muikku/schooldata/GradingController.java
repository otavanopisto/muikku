package fi.muikku.schooldata;

import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.grading.GradingScaleEntityDAO;
import fi.muikku.dao.grading.GradingScaleItemEntityDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.grading.GradingScaleEntity;
import fi.muikku.model.grading.GradingScaleItemEntity;
import fi.muikku.schooldata.entity.GradingScale;
import fi.muikku.schooldata.entity.GradingScaleItem;

@Dependent
@Stateless
public class GradingController {
	
	@Inject
	private Logger logger;
	
	@Inject
	private GradingSchoolDataController gradingSchoolDataController;

	@Inject
	private GradingScaleEntityDAO gradingScaleEntityDAO;
	
	@Inject
	private GradingScaleItemEntityDAO gradingScaleItemEntityDAO; 

	@Inject
	private SchoolDataSourceDAO schoolDataSourceDAO;

	/* GradingScaleEntity */

	public GradingScaleEntity findGradingScaleEntityById(Long id) {
		return gradingScaleEntityDAO.findById(id);
	}
	
	public GradingScaleEntity findGradingScaleEntityById(SchoolDataSource schoolDataSource, String identifier) {
		return gradingScaleEntityDAO.findByDataSourceAndIdentifier(schoolDataSource, identifier);
	}
	
	public List<GradingScaleEntity> listGradingScaleEntities() {
		return gradingScaleEntityDAO.listAll();
	}

	/* GradingScaleItemEntity */

	public GradingScaleItemEntity findGradingScaleItemEntityById(Long id) {
		return gradingScaleItemEntityDAO.findById(id);
	}
	
	public GradingScaleItemEntity findGradingScaleItemEntityById(SchoolDataSource schoolDataSource, String identifier) {
		return gradingScaleItemEntityDAO.findByDataSourceAndIdentifier(schoolDataSource, identifier);
	}
	
	public List<GradingScaleItemEntity> listGradingScaleItemEntities() {
		return gradingScaleItemEntityDAO.listAll();
	}

	/* GradingScale */

	public GradingScale findGradingScale(GradingScaleEntity entity) {
		return gradingSchoolDataController.findGradingScale(entity.getDataSource(), entity.getIdentifier());
	}

	public List<GradingScale> listGradingScales() {
		return gradingSchoolDataController.listGradingScales();
	}
	
	/* GradingScaleItem */

	public GradingScaleItem findGradingScaleItem(GradingScale gradingScale, GradingScaleItemEntity entity) {
		return gradingSchoolDataController.findGradingScaleItem(entity.getDataSource(), gradingScale, entity.getIdentifier());
	}

	public List<GradingScaleItem> listGradingScaleItems(GradingScale gradingScale) {
		return gradingSchoolDataController.listGradingScaleItems(gradingScale);
	}
}
