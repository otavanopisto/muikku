package fi.muikku.plugins.schooldatamock.entities;

import fi.muikku.plugins.schooldatamock.SchoolDataMockPluginDescriptor;
import fi.muikku.schooldata.entity.GradingScaleItem;

public class MockedGradingScaleItem implements GradingScaleItem {

	public MockedGradingScaleItem(String identifier, String gradingScaleIdentifier, String name) {
		this.identifier = identifier;
		this.gradingScaleIdentifier = gradingScaleIdentifier;
		this.name = name;
	}

	@Override
	public String getSchoolDataSource() {
		return SchoolDataMockPluginDescriptor.SCHOOL_DATA_SOURCE;
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
