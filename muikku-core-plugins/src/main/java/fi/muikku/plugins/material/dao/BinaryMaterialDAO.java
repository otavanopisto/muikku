package fi.muikku.plugins.material.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.material.model.BinaryMaterial;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.BinaryMaterial_;

public class BinaryMaterialDAO extends PluginDAO<BinaryMaterial> {

	private static final long serialVersionUID = 1L;

	public BinaryMaterial create(String title, String urlName, String contentType, byte[] content) {
		BinaryMaterial binaryMaterial = new BinaryMaterial();
		binaryMaterial.setContent(content);
		binaryMaterial.setContentType(contentType);
		binaryMaterial.setTitle(title);
		binaryMaterial.setUrlName(urlName);
		return persist(binaryMaterial);
	}

	public BinaryMaterial findByUrlName(String urlName) {
		EntityManager entityManager = getEntityManager();

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Material> criteria = criteriaBuilder.createQuery(Material.class);
		Root<Material> root = criteria.from(Material.class);
		criteria.select(root);
		criteria.where(criteriaBuilder.equal(root.get(BinaryMaterial_.urlName), urlName));

		return getSingleResult(entityManager.createQuery(criteria));
	}

	public BinaryMaterial updateContent(BinaryMaterial binaryMaterial, byte[] content) {
		binaryMaterial.setContent(content);
		return persist(binaryMaterial);
	}
	
}
