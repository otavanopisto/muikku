package fi.otavanopisto.muikku.plugins.transcriptofrecords;

import java.io.File;
import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.dao.TranscriptOfRecordsFileDAO;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.model.TranscriptOfRecordsFile;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class TranscriptOfRecordsFileController {
  
  @Inject
  private TranscriptOfRecordsFileDAO transcriptOfRecordsFileDAO;
  
  public void attachFile(UserEntity student, File file, String title, String description) {
    transcriptOfRecordsFileDAO.create(
        student,
        file.getAbsolutePath(),
        title,
        description
        );
  }
  
  
  public List<TranscriptOfRecordsFile> listFiles(SchoolDataIdentifier studentIdentifier) {
    return null;
  }

}
