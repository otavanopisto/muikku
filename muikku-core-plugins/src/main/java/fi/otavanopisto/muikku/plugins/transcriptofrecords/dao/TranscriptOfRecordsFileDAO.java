package fi.otavanopisto.muikku.plugins.transcriptofrecords.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.model.TranscriptOfRecordsFile;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.model.TranscriptOfRecordsFile_;

public class TranscriptOfRecordsFileDAO extends CorePluginsDAO<TranscriptOfRecordsFile>{
  private static final long serialVersionUID = 1L;

  public TranscriptOfRecordsFile create(
      UserEntity userEntity,
      String fileName,
      String contentType,
      String title,
      String description
  ) {
    TranscriptOfRecordsFile transcriptOfRecordsFile = new TranscriptOfRecordsFile(
        userEntity.getId(),
        fileName,
        contentType,
        false,
        title,
        description);
    return persist(transcriptOfRecordsFile);
  }
  
  public List<TranscriptOfRecordsFile> listByUserEntity(UserEntity userEntity) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<TranscriptOfRecordsFile> criteria = criteriaBuilder.createQuery(TranscriptOfRecordsFile.class);
    Root<TranscriptOfRecordsFile> root = criteria.from(TranscriptOfRecordsFile.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(TranscriptOfRecordsFile_.userEntityId), userEntity.getId()),
        criteriaBuilder.equal(root.get(TranscriptOfRecordsFile_.archived), false)
      )
    );

    return entityManager.createQuery(criteria).getResultList();
  }
  
  public void archive(TranscriptOfRecordsFile file) {
    file.setArchived(true);
  }
}
