package fi.muikku.plugins.dnm.parser.structure;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import fi.muikku.plugins.dnm.parser.structure.model.ResourceContainer;

import fi.muikku.plugins.dnm.parser.structure.model.Resource;

public class DeusNexDocumentUtils {

	public static String getRelativePath(DeusNexDocument deusNexDocument, Resource resource, Resource reference) {
		List<String> result = new ArrayList<String>();
		
		ResourceContainer parent = deusNexDocument.getParent(resource);
		while (parent != null && !parent.getNo().equals(reference.getNo())) {
			result.add(0, parent.getName());
			parent = deusNexDocument.getParent(parent);
		}
		
		result.add(resource.getName());
		
		return StringUtils.join(result, '/');
	}

}
