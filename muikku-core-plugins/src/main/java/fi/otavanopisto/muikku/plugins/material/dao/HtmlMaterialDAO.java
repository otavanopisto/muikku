package fi.otavanopisto.muikku.plugins.material.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.HtmlMaterial;
import fi.otavanopisto.muikku.plugins.material.model.HtmlMaterial_;
import fi.otavanopisto.muikku.plugins.material.model.MaterialViewRestrict;

public class HtmlMaterialDAO extends CorePluginsDAO<HtmlMaterial> {

  private static final long serialVersionUID = 3344543661453014697L;

  public HtmlMaterial create(String title, String html, String contentType, HtmlMaterial originMaterial, String license, MaterialViewRestrict viewRestrict) {
    HtmlMaterial htmlMaterial = new HtmlMaterial();

    htmlMaterial.setHtml(html);
    htmlMaterial.setTitle(title);
    htmlMaterial.setOriginMaterial(originMaterial);
    htmlMaterial.setContentType(contentType);
    htmlMaterial.setLicense(license);
    htmlMaterial.setViewRestrict(viewRestrict);

    return persist(htmlMaterial);
  }

  public void delete(HtmlMaterial htmlMaterial) {
    super.delete(htmlMaterial);
  }

  public List<HtmlMaterial> listByLike(String like, int maxResults) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<HtmlMaterial> criteria = criteriaBuilder.createQuery(HtmlMaterial.class);
    Root<HtmlMaterial> root = criteria.from(HtmlMaterial.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.like(root.get(HtmlMaterial_.html), "%" + like + "%"));

    return entityManager.createQuery(criteria).setMaxResults(maxResults).getResultList();
  }

  public HtmlMaterial updateData(HtmlMaterial htmlMaterial, String html) {
    htmlMaterial.setHtml(html);
    return persist(htmlMaterial);
  }

  public HtmlMaterial updateTitle(HtmlMaterial htmlMaterial, String title) {
    htmlMaterial.setTitle(title);
    return persist(htmlMaterial);
  }

}
