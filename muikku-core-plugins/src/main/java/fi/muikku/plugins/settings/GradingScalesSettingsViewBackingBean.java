package fi.muikku.plugins.settings;

import java.io.Serializable;
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
public class GradingScalesSettingsViewBackingBean implements Serializable {

	private static final long serialVersionUID = 1439377389804904551L;

	@Inject
	private GradingController gradingController;

	public List<GradingScale> getGradingScales() {
		return gradingController.listGradingScales();
	}

}