package fi.otavanopisto.muikku.plugins.dnm.parser.structure;

import fi.otavanopisto.muikku.plugins.dnm.parser.structure.model.Folder;
import fi.otavanopisto.muikku.plugins.dnm.parser.structure.model.Resource;
import fi.otavanopisto.muikku.plugins.dnm.parser.structure.model.ResourceContainer;
import fi.otavanopisto.muikku.plugins.dnm.parser.structure.model.Type;

public interface DeusNexDocument {

	public Folder getRootFolder();
	public Resource getResourceByNo(Integer no);
	public ResourceContainer getParent(Resource resource);
	public ResourceContainer getAncestorByType(Resource resource, Type type);
	
}
