package fi.muikku.plugins.materialfields.dao;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.materialfields.model.RightAnswer;
import fi.muikku.plugins.materialfields.model.QueryField;

@DAO
public class RightAnswerDAO extends PluginDAO<RightAnswer> {

  private static final long serialVersionUID = 3285606882168941401L;

  public RightAnswer create(Double points, String text, boolean caseSensitive, boolean normalizeWhitespace, QueryField field) {

    RightAnswer rightAnswer = new RightAnswer();
    rightAnswer.setPoints(points);
    rightAnswer.setText(text);
    rightAnswer.setCaseSensitive(caseSensitive);
    rightAnswer.setNormalizeWhitespace(normalizeWhitespace);
    rightAnswer.setField(field);

    return persist(rightAnswer);

  }

}
