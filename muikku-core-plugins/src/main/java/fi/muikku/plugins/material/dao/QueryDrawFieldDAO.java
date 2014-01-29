package fi.muikku.plugins.material.dao;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QueryDrawField;

@DAO
public class QueryDrawFieldDAO extends PluginDAO<QueryDrawField> {

  private static final long serialVersionUID = 752946302740645731L;

  public QueryDrawField create(Material material, String name, String text, String canvasHtml) {

    QueryDrawField queryDrawField = new QueryDrawField();

    queryDrawField.setMaterial(material);
    queryDrawField.setName(name);
    queryDrawField.setText(text);
    queryDrawField.setCanvasHtml(canvasHtml);

    return persist(queryDrawField);

  }

}
