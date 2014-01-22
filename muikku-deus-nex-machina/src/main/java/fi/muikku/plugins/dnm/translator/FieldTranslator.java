package fi.muikku.plugins.dnm.translator;

import java.util.ArrayList;
import java.util.List;

import fi.muikku.plugins.dnm.parser.content.ConnectFieldOption;
import fi.muikku.plugins.dnm.parser.content.OptionListOption;
import fi.muikku.plugins.dnm.parser.content.RightAnswer;
import fi.muikku.plugins.material.fieldmeta.ConnectFieldMeta;
import fi.muikku.plugins.material.fieldmeta.ConnectFieldOptionMeta;
import fi.muikku.plugins.material.fieldmeta.ConnectFieldConnectionMeta;
import fi.muikku.plugins.material.fieldmeta.MemoFieldMeta;
import fi.muikku.plugins.material.fieldmeta.SelectFieldMeta;
import fi.muikku.plugins.material.fieldmeta.TextFieldMeta;

public class FieldTranslator {
  
  private static final int ALPHABET_SIZE = 26;
  
  private static String getExcelStyleLetterIndex(int numericIndex) {   
    String result = "";
    
    do {
      int charIndex = numericIndex % ALPHABET_SIZE;
      numericIndex /= ALPHABET_SIZE;
      numericIndex -= 1;
      
      result = new String(Character.toChars(charIndex + 'A')) + result;
    } while (numericIndex > -1);
    
    return result;
  }
  
  public TextFieldMeta translateTextField(String name, Integer columns, List<RightAnswer> rightAnswers, String help, String hint) {
    List<TextFieldMeta.RightAnswer> translatedAnswers = new ArrayList<>();
    for (fi.muikku.plugins.dnm.parser.content.RightAnswer rightAnswer : rightAnswers) {
      Double points;
      if (rightAnswer.getPoints() == null) {
        points = 0.0;
      } else {
        points = rightAnswer.getPoints();
      }
      translatedAnswers.add(new TextFieldMeta.RightAnswer(points, rightAnswer.getText(), true, false));
    }
    return new TextFieldMeta(name, columns, translatedAnswers, help, hint);
  }

  public MemoFieldMeta translateMemoField(String name, Integer columns, Integer rows, String help, String hint) {
    return new MemoFieldMeta(name, columns, rows, help, hint);
  }
  
  public SelectFieldMeta translateOptionList(String name, String listType, List<OptionListOption> options) {
    List<SelectFieldMeta.Option> translatedOptions = new ArrayList<>();
    for (OptionListOption option : options) {
      translatedOptions.add(new SelectFieldMeta.Option(option.getName(), option.getPoints(), option.getText()));
    }
    return new SelectFieldMeta(name, listType, translatedOptions);
  }
  
  public ConnectFieldMeta translateConnectField(String name, List<ConnectFieldOption> options) {
    
    List<ConnectFieldOptionMeta> connectFieldOptionMetas = new ArrayList<ConnectFieldOptionMeta>();
    List<ConnectFieldOptionMeta> counterparts = new ArrayList<ConnectFieldOptionMeta>();;
    List<ConnectFieldConnectionMeta> connectFieldConnectionMetas = new ArrayList<>();
    
    for (int i = 0; i < options.size(); i++) {
      
      ConnectFieldOption option = options.get(i);
      String fieldName = String.valueOf(i+1);
      String counterpartName = getExcelStyleLetterIndex(i);
      
      connectFieldOptionMetas.add(new ConnectFieldOptionMeta(fieldName, option.getTerm()));
      counterparts.add(new ConnectFieldOptionMeta(counterpartName, option.getEquivalent()));
      connectFieldConnectionMetas.add(new ConnectFieldConnectionMeta(fieldName, option.getAnswer()));
    }
    
    return new ConnectFieldMeta(name, connectFieldOptionMetas, counterparts, connectFieldConnectionMetas);
  }
}
