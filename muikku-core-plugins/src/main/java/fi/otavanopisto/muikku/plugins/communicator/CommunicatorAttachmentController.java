package fi.otavanopisto.muikku.plugins.communicator;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.lang3.RandomStringUtils;

import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageAttachmentDAO;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageAttachment;

@Dependent
public class CommunicatorAttachmentController {
  
  @Inject
  private CommunicatorMessageAttachmentDAO communicatorMessageAttachmentDAO;
  
  public CommunicatorMessageAttachment create(String contentType, byte[] content){
    return communicatorMessageAttachmentDAO.create(RandomStringUtils.randomAlphanumeric(64), contentType, content);
  }
  
  public CommunicatorMessageAttachment findByName(String name){
    return communicatorMessageAttachmentDAO.findByName(name);
  }
  
  
}
