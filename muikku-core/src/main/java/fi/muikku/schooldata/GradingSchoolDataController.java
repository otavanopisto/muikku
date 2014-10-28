package fi.muikku.schooldata;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.schooldata.entity.GradingScale;
import fi.muikku.schooldata.entity.GradingScaleItem;

@Dependent
@Stateful
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
		SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(identifier);
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
		SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(identifier);
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
