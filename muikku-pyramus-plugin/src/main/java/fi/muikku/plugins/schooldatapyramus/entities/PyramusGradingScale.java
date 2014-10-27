package fi.muikku.plugins.schooldatapyramus.entities;

import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.muikku.schooldata.entity.GradingScale;

public class PyramusGradingScale implements GradingScale {

	public PyramusGradingScale(String identifier, String name) {
		super();
		this.identifier = identifier;
		this.name = name;
	}

	@Override
	public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
	}

	@Override
	public String getIdentifier() {
		return identifier;
	}

	@Override
	public String getName() {
		return name;
	}

	private String identifier;
	private String name;
}
