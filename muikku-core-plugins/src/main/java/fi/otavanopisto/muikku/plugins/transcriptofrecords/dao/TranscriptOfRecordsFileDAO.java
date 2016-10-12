package fi.otavanopisto.muikku.plugins.transcriptofrecords.dao;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.model.TranscriptOfRecordsFile;

public class TranscriptOfRecordsFileDAO extends CorePluginsDAO<TranscriptOfRecordsFile>{
  public TranscriptOfRecordsFile create(
      UserEntity userEntity,
      String fileName,
      String title,
      String description
  ) {
    TranscriptOfRecordsFile transcriptOfRecordsFile = new TranscriptOfRecordsFile(
        userEntity.getId(),
        fileName,
        false,
        title,
        description);
    return persist(transcriptOfRecordsFile);
  }
}
