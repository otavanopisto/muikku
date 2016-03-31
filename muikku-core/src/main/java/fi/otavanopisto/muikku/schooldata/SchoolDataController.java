package fi.otavanopisto.muikku.schooldata;

import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.base.SchoolDataSourceDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;

public class SchoolDataController {

	@Inject
	private SchoolDataSourceDAO schoolDataSourceDAO;

	public SchoolDataSource createSchoolDataSource(String identifier) {
		return schoolDataSourceDAO.create(identifier);
	}

	public SchoolDataSource findSchoolDataSource(String identifier) {
		return schoolDataSourceDAO.findByIdentifier(identifier);
	}
	
	public List<SchoolDataSource> listSchoolDataSources() {
	  return schoolDataSourceDAO.listAll();
	}

}
