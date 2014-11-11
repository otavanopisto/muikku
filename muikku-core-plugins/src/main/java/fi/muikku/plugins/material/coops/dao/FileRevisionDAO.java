package fi.muikku.plugins.material.coops.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.material.coops.model.File;
import fi.muikku.plugins.material.coops.model.FileRevision;
import fi.muikku.plugins.material.coops.model.FileRevision_;

public class FileRevisionDAO extends CorePluginsDAO<FileRevision> {

  private static final long serialVersionUID = -8715223954604734705L;

  public FileRevision create(File file, String sessionId, Long revision, Date created, String data, String checksum) {
    FileRevision fileRevision = new FileRevision();

    fileRevision.setChecksum(checksum);
    fileRevision.setCreated(created);
    fileRevision.setData(data);
    fileRevision.setFile(file);
    fileRevision.setRevision(revision);
    fileRevision.setSessionId(sessionId);

    return persist(fileRevision);
  }

  public List<FileRevision> listByFileAndRevisionGreaterThan(File file, Long revision) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<FileRevision> criteria = criteriaBuilder.createQuery(FileRevision.class);
    Root<FileRevision> root = criteria.from(FileRevision.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(FileRevision_.file), file),
        criteriaBuilder.greaterThan(root.get(FileRevision_.revision), revision)
      )
    );

    return entityManager.createQuery(criteria).getResultList();
  }

}
