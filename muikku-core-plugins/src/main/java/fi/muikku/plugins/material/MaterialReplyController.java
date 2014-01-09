package fi.muikku.plugins.material;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.material.dao.MaterialReplyDAO;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.MaterialReply;

@Dependent
@Stateless
public class MaterialReplyController {
  
  @Inject
	private MaterialReplyDAO materialReplyDAO;
	
  public MaterialReply createMaterialReply(Material material, UserEntity userEntity) {
    return materialReplyDAO.create(material, userEntity.getId());
  }

  public MaterialReply findMaterialReplyByMaterialAndUserEntity(Material material, UserEntity userEntity) {
    return materialReplyDAO.findByMaterialAndUserId(material, userEntity.getId());
  }

}
