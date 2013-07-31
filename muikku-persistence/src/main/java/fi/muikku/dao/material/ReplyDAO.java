package fi.muikku.dao.material;

import fi.muikku.dao.CoreDAO;
import fi.muikku.model.material.Reply;

public class ReplyDAO extends CoreDAO<Reply> {

  /**
   * 
   */
  private static final long serialVersionUID = -7827461949753031397L;

  public Reply create(String type, String characterData, byte[] binaryData) {
    Reply reply = new Reply();
    reply.setType(type);
    reply.setCharacterData(characterData);
    reply.setBinaryData(binaryData);
    getEntityManager().persist(reply);
    return reply;
  }
  
  public void delete(Reply reply) {
    super.delete(reply);
  }
  
}