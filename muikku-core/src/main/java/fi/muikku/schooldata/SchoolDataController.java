package fi.muikku.schooldata;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.model.base.SchoolDataSource;

@Dependent
@Stateful
public class SchoolDataController {

	@Inject
	private SchoolDataSourceDAO schoolDataSourceDAO;

	public SchoolDataSource createSchoolDataSource(String identifier) {
		return schoolDataSourceDAO.create(identifier);
	}

	public SchoolDataSource findSchoolDataSource(String identifier) {
		return schoolDataSourceDAO.findByIdentifier(identifier);
	}

}
