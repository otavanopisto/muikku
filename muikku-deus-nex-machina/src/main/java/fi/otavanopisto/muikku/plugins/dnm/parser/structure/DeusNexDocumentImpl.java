package fi.otavanopisto.muikku.plugins.dnm.parser.structure;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import fi.otavanopisto.muikku.plugins.dnm.parser.structure.model.Folder;
import fi.otavanopisto.muikku.plugins.dnm.parser.structure.model.Resource;
import fi.otavanopisto.muikku.plugins.dnm.parser.structure.model.ResourceContainer;
import fi.otavanopisto.muikku.plugins.dnm.parser.structure.model.Type;

public class DeusNexDocumentImpl implements DeusNexDocument {

	public Folder getRootFolder() {
		return rootFolder;
	}
	
	public void setRootFolder(Folder rootFolder) {
		this.rootFolder = rootFolder;
		mapResources(this.rootFolder);
		mapParents(this.rootFolder);
	}
	
	@Override
	public Resource getResourceByNo(Integer no) {
		return resourceMap.get(no);
	}
	
	@Override
	public ResourceContainer getParent(Resource resource) {
		return (ResourceContainer) getResourceByNo(this.parents.get(resource.getNo()));
	}
	
	@Override
	public ResourceContainer getAncestorByType(Resource resource, Type type) {
		ResourceContainer parent = getParent(resource);
		while (parent != null && parent.getType() != type) {
			parent = getParent(parent);
		}
		
		return parent;
	}
	
	private void mapResources(Resource resource) {
		resourceMap.put(resource.getNo(), resource);
		
		if (resource instanceof ResourceContainer) {
		  List<Resource> children = ((ResourceContainer) resource).getResources();
		  if (children != null) {
			  for (Resource child : children) {
				  mapResources(child);
			  }
		  }
		}
	}
	
	private void mapParents(Resource resource) {
		if (resource instanceof ResourceContainer) {
		  List<Resource> children = ((ResourceContainer) resource).getResources();
		  if (children != null) {
  			for (Resource child : children) {
  				parents.put(child.getNo(), resource.getNo());
  				mapParents(child);
  			}
		  }
		}
	}

	private Folder rootFolder;
	private Map<Integer, Resource> resourceMap = new HashMap<>();
	private Map<Integer, Integer> parents = new HashMap<>();
}
