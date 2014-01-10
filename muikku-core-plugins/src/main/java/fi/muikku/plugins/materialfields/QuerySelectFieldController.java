package fi.muikku.plugins.materialfields;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.materialfields.dao.QuerySelectFieldDAO;
import fi.muikku.plugins.materialfields.model.QuerySelectField;

@Stateless
@Dependent
public class QuerySelectFieldController {

  @Inject
  QuerySelectFieldDAO querySelectFieldDAO;

  public QuerySelectField createQuerySelectField(Material material, String name, Boolean mandatory) {
    return querySelectFieldDAO.create(material, name, mandatory);
  }

  public QuerySelectField findQuerySelectFieldbyId(Long id) {
    return querySelectFieldDAO.findById(id);
  }

}
