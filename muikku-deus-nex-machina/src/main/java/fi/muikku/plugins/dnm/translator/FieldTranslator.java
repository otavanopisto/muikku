package fi.muikku.plugins.dnm.translator;

import java.util.ArrayList;
import java.util.List;

import fi.muikku.plugins.dnm.parser.content.ConnectFieldOption;
import fi.muikku.plugins.dnm.parser.content.OptionListOption;
import fi.muikku.plugins.dnm.parser.content.RightAnswer;
import fi.muikku.plugins.material.model.field.ConnectField;
import fi.muikku.plugins.material.model.field.MemoField;
import fi.muikku.plugins.material.model.field.SelectField;
import fi.muikku.plugins.material.model.field.TextField;

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
  
  public TextField translateTextField(String name, Integer columns, List<RightAnswer> rightAnswers, String help, String hint) {
    List<TextField.RightAnswer> translatedAnswers = new ArrayList<>();
    for (fi.muikku.plugins.dnm.parser.content.RightAnswer rightAnswer : rightAnswers) {
      Double points;
      if (rightAnswer.getPoints() == null) {
        points = 0.0;
      } else {
        points = rightAnswer.getPoints();
      }
      translatedAnswers.add(new TextField.RightAnswer(points, rightAnswer.getText(), true, false));
    }
    return new TextField(name, columns, translatedAnswers, help, hint);
  }

  public MemoField translateMemoField(String name, Integer columns, Integer rows, String help, String hint) {
    return new MemoField(name, columns, rows, help, hint);
  }
  
  public SelectField translateOptionList(String name, String listType, List<OptionListOption> options) {
    List<SelectField.Option> translatedOptions = new ArrayList<>();
    for (OptionListOption option : options) {
      translatedOptions.add(new SelectField.Option(option.getName(), option.getPoints(), option.getText()));
    }
    return new SelectField(name, listType, translatedOptions);
  }
  
  public ConnectField translateConnectField(String name, List<ConnectFieldOption> options) {
    
    List<ConnectField.Field> fields = new ArrayList<ConnectField.Field>();
    List<ConnectField.Field> counterparts = new ArrayList<ConnectField.Field>();;
    List<ConnectField.Connection> connections = new ArrayList<>();
    
    for (int i = 0; i < options.size(); i++) {
      
      ConnectFieldOption option = options.get(i);
      String fieldName = String.valueOf(i+1);
      String counterpartName = getExcelStyleLetterIndex(i);
      
      fields.add(new ConnectField.Field(fieldName, option.getTerm()));
      counterparts.add(new ConnectField.Field(counterpartName, option.getEquivalent()));
      connections.add(new ConnectField.Connection(fieldName, option.getAnswer()));
    }
    
    return new ConnectField(name, fields, counterparts, connections);
  }
}
