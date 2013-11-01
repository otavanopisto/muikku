package fi.muikku.plugins.dnm.parser.structure;

import fi.muikku.plugins.dnm.parser.structure.model.Folder;
import fi.muikku.plugins.dnm.parser.structure.model.Resource;
import fi.muikku.plugins.dnm.parser.structure.model.ResourceContainer;
import fi.muikku.plugins.dnm.parser.structure.model.Type;

public interface DeusNexDocument {

	public Folder getRootFolder();
	public Resource getResourceByNo(Integer no);
	public ResourceContainer getParent(Resource resource);
	public ResourceContainer getAncestorByType(Resource resource, Type type);
	
}
