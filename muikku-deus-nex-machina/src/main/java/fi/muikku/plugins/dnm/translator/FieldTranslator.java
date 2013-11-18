package fi.muikku.plugins.dnm.translator;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import fi.muikku.plugins.dnm.parser.content.ConnectFieldOption;
import fi.muikku.plugins.dnm.parser.content.OptionListOption;
import fi.muikku.plugins.dnm.parser.content.RightAnswer;
import fi.muikku.plugins.material.model.field.ConnectField;
import fi.muikku.plugins.material.model.field.OptionListField;
import fi.muikku.plugins.material.model.field.TextField;
import fi.muikku.plugins.material.model.field.ConnectField.Connection;
import fi.muikku.plugins.material.model.field.ConnectField.Field;

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
  
  public Object translateTextField(List<RightAnswer> rightAnswers) {
    List<TextField.RightAnswer> translatedAnswers = new ArrayList<>();
    for (fi.muikku.plugins.dnm.parser.content.RightAnswer rightAnswer : rightAnswers) {
      translatedAnswers.add(new TextField.RightAnswer(rightAnswer.getPoints(), rightAnswer.getText(), true, false));
    }
    return new TextField(translatedAnswers);
  }
  
  public Object translateOptionList(List<OptionListOption> options) {
    List<OptionListField.Option> translatedOptions = new ArrayList<>();
    for (OptionListOption option : options) {
      translatedOptions.add(new OptionListField.Option(option.getName(), option.getPoints(), option.getText()));
    }
    return new OptionListField(translatedOptions);
  }
  
  public Object translateConnectField(List<ConnectFieldOption> options) {
    
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
    
    return new ConnectField(fields, counterparts, connections);
  }
}
