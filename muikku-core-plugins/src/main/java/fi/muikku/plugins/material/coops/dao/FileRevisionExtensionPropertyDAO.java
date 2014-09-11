package fi.muikku.plugins.material.coops.dao;

import fi.muikku.plugin.PluginDAO;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugins.material.coops.model.FileRevision;
import fi.muikku.plugins.material.coops.model.FileRevisionExtensionProperty;
import fi.muikku.plugins.material.coops.model.FileRevisionExtensionProperty_;

public class FileRevisionExtensionPropertyDAO extends PluginDAO<FileRevisionExtensionProperty> {

  private static final long serialVersionUID = -8715223954604734705L;

  public FileRevisionExtensionProperty create(FileRevision fileRevision, String key, String value) {
    FileRevisionExtensionProperty fileRevisionExtensionProperty = new FileRevisionExtensionProperty();

    fileRevisionExtensionProperty.setFileRevision(fileRevision);
    fileRevisionExtensionProperty.setValue(value);
    fileRevisionExtensionProperty.setKey(key);

    return persist(fileRevisionExtensionProperty);
  }

  public List<FileRevisionExtensionProperty> listByFileRevision(FileRevision fileRevision) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<FileRevisionExtensionProperty> criteria = criteriaBuilder.createQuery(FileRevisionExtensionProperty.class);
    Root<FileRevisionExtensionProperty> root = criteria.from(FileRevisionExtensionProperty.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(FileRevisionExtensionProperty_.fileRevision), fileRevision)
    );

    return entityManager.createQuery(criteria).getResultList();
  }

}
