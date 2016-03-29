package fi.otavanopisto.muikku.plugins.dnm.parser.structure.model;

import java.util.List;

public abstract class ResourceContainer extends Resource {

	public List<Resource> getResources() {
		return resources;
	}

	public void setResources(List<Resource> resources) {
		this.resources = resources;
	}

	private List<Resource> resources;

}
