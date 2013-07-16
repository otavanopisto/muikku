package fi.muikku.schooldata;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.grading.GradingScaleEntityDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.grading.GradingScaleEntity;
import fi.muikku.schooldata.entity.GradingScale;

@Stateless
@Dependent
@SchoolDataBridgeEntityInitiator ( entity = GradingScale.class )
public class GradingScaleSchoolDataEntityInitiator implements SchoolDataEntityInitiator<GradingScale> {

	@Inject
	private Logger logger;

	@Inject
	private SchoolDataSourceDAO schoolDataSourceDAO;
	
	@Inject
	private GradingScaleEntityDAO gradingScaleEntityDAO;

	@Inject
	@Any
	private Instance<SchoolDataEntityInitiator<GradingScale>> workspaceInitiators;

	@Override
	public GradingScale single(GradingScale gradingScale) {
		SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(gradingScale.getSchoolDataSource());
		GradingScaleEntity gradingScaleEntity = gradingScaleEntityDAO.findByDataSourceAndIdentifier(dataSource, gradingScale.getIdentifier());
		if (gradingScaleEntity == null) {
			gradingScaleEntityDAO.create(dataSource, gradingScale.getIdentifier(), Boolean.FALSE);
		}

		return gradingScale;
	}

	@Override
	public List<GradingScale> list(List<GradingScale> gradingScales) {
		List<GradingScale> result = new ArrayList<>();
		
		for (GradingScale gradingScale : gradingScales) {
			gradingScale = single(gradingScale);
			if (gradingScale != null) {
				result.add(gradingScale);
			}
		}
		
		return result;
	}

}
