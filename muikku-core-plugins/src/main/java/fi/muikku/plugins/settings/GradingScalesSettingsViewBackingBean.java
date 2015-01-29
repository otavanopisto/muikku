package fi.muikku.plugins.settings;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.schooldata.GradingController;
import fi.muikku.schooldata.entity.GradingScale;

@Named
@Stateful
@RequestScoped
public class GradingScalesSettingsViewBackingBean {

	@Inject
	private GradingController gradingController;

	public List<GradingScale> getGradingScales() {
		return gradingController.listGradingScales();
	}

}