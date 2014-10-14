package fi.muikku.plugins.material;

import java.lang.reflect.ParameterizedType;
import java.util.Iterator;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.plugins.material.dao.MaterialDAO;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.operations.MaterialCloneOperation;

@Dependent
@Stateless
public class MaterialController {
  
  @Inject
  @Any
  private Instance<MaterialCloneOperation<?>> cloneOperations;
  
	@Inject
	private MaterialDAO materialDAO;
	
	public Material findMaterialById(Long id) {
		return materialDAO.findById(id);
	}
	
  public <T> T cloneMaterial(T material) {
    Iterator<MaterialCloneOperation<?>> operations = cloneOperations.iterator();
	  
    while (operations.hasNext()) {
      @SuppressWarnings("unchecked") MaterialCloneOperation<T> operation = (MaterialCloneOperation<T>) operations.next();
      Class<?> operationMaterialType = (Class<?>) ((ParameterizedType) operation.getClass().getGenericSuperclass()).getActualTypeArguments()[0];
      if (material.getClass().isAssignableFrom(operationMaterialType)) {
        return operation.clone(material);
      }
    }
	  
    return null;
	}

}
