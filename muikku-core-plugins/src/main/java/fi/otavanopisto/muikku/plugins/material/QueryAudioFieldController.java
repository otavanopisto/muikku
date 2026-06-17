package fi.otavanopisto.muikku.plugins.material;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.material.Material;
import fi.otavanopisto.muikku.model.material.QueryAudioField;
import fi.otavanopisto.muikku.plugins.material.dao.QueryAudioFieldDAO;

@Dependent
public class QueryAudioFieldController {

  @Inject
  private QueryAudioFieldDAO queryAudioFieldDAO;
  
  public QueryAudioField createQueryAudioField(Material material, String name) {
    return queryAudioFieldDAO.create(material, name);
  }

  public QueryAudioField findQueryAudioFieldbyId(Long id) {
    return queryAudioFieldDAO.findById(id);
  }

  public QueryAudioField findQueryAudioFieldByMaterialAndName(Material material, String name) {
    return queryAudioFieldDAO.findByMaterialAndName(material, name);
  }

}
