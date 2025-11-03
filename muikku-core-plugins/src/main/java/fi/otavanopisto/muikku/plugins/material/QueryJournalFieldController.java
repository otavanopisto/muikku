package fi.otavanopisto.muikku.plugins.material;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.material.dao.QueryJournalFieldDAO;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.QueryJournalField;

@Dependent
public class QueryJournalFieldController {

  @Inject
  private QueryJournalFieldDAO queryJournalFieldDAO;
  
  public QueryJournalField createQueryJournalField(Material material, String name) {
    return queryJournalFieldDAO.create(material, name);
  }

  public QueryJournalField findQueryJournalFieldbyId(Long id) {
    return queryJournalFieldDAO.findById(id);
  }

  public QueryJournalField findQueryJournalFieldByMaterialAndName(Material material, String name) {
    return queryJournalFieldDAO.findByMaterialAndName(material, name);
  }

}
