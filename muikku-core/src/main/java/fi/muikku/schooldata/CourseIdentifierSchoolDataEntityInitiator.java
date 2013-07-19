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
import fi.muikku.dao.coursemeta.CourseIdentifierEntityDAO;
import fi.muikku.dao.coursemeta.CourseIdentifierSchoolDataIdentifierDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.coursemeta.CourseIdentifierEntity;
import fi.muikku.model.coursemeta.CourseIdentifierSchoolDataIdentifier;
import fi.muikku.schooldata.entity.CourseIdentifier;

@Stateless
@Dependent
@SchoolDataBridgeEntityInitiator ( entity = CourseIdentifier.class )
public class CourseIdentifierSchoolDataEntityInitiator implements SchoolDataEntityInitiator<CourseIdentifier> {
	
	@Inject
	private Logger logger;

	@Inject
	private SchoolDataSourceDAO schoolDataSourceDAO;
	
	@Inject
	private CourseIdentifierEntityDAO courseIdentifierEntityDAO;
	
	@Inject
	private CourseIdentifierSchoolDataIdentifierDAO courseIdentifierSchoolDataIdentifierDAO;

	@Inject
	@Any
	private Instance<SchoolDataEntityInitiator<CourseIdentifier>> workspaceInitiators;

	@Override
	public CourseIdentifier single(CourseIdentifier courseIdentifier) {
		SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(courseIdentifier.getSchoolDataSource());
		if (dataSource != null) {
		  CourseIdentifierSchoolDataIdentifier schoolDataIdentifier = courseIdentifierSchoolDataIdentifierDAO.findByDataSourceAndIdentifier(dataSource, courseIdentifier.getIdentifier());
		  if (schoolDataIdentifier == null) {
		  	CourseIdentifierEntity courseIdentifierEntity = courseIdentifierEntityDAO.create(Boolean.FALSE);
		  	courseIdentifierSchoolDataIdentifierDAO.create(dataSource, courseIdentifier.getIdentifier(), courseIdentifierEntity);
		  }
		}

		return courseIdentifier;
	}

	@Override
	public List<CourseIdentifier> list(List<CourseIdentifier> courseIdentifiers) {
		List<CourseIdentifier> result = new ArrayList<>();
		
		for (CourseIdentifier courseIdentifier : courseIdentifiers) {
			courseIdentifier = single(courseIdentifier);
			if (courseIdentifier != null) {
				result.add(courseIdentifier);
			}
		}
		
		return result;
	}
}
