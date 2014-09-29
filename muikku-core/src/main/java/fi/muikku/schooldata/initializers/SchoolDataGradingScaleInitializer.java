package fi.muikku.schooldata.initializers;

import java.util.List;

import fi.muikku.schooldata.entity.GradingScale;

public interface SchoolDataGradingScaleInitializer extends SchoolDataEntityInitializer {

	public List<GradingScale> init(List<GradingScale> gradingScales);
	
}
