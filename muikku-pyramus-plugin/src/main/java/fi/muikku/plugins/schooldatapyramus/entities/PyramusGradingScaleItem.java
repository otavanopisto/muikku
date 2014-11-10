package fi.muikku.plugins.schooldatapyramus.entities;

import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.muikku.schooldata.entity.GradingScaleItem;

public class PyramusGradingScaleItem implements GradingScaleItem {

	public PyramusGradingScaleItem(String identifier, String gradingScaleIdentifier, String name) {
		this.identifier = identifier;
		this.gradingScaleIdentifier = gradingScaleIdentifier;
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
	public String getGradingScaleIdentifier() {
		return gradingScaleIdentifier;
	}

	@Override
	public String getName() {
		return name;
	}

	private String identifier;
	private String gradingScaleIdentifier;
	private String name;
}
