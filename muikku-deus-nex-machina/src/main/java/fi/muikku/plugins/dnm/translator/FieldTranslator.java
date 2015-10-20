package fi.muikku.plugins.dnm.translator;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.plugins.dnm.parser.content.ConnectFieldOption;
import fi.muikku.plugins.dnm.parser.content.OptionListOption;
import fi.muikku.plugins.dnm.parser.content.RightAnswer;
import fi.muikku.plugins.material.fieldmeta.MultiSelectFieldMeta;
import fi.muikku.plugins.material.fieldmeta.MultiSelectFieldOptionMeta;
import fi.muikku.plugins.material.fieldmeta.ConnectFieldMeta;
import fi.muikku.plugins.material.fieldmeta.ConnectFieldOptionMeta;
import fi.muikku.plugins.material.fieldmeta.ConnectFieldConnectionMeta;
import fi.muikku.plugins.material.fieldmeta.FileFieldMeta;
import fi.muikku.plugins.material.fieldmeta.MemoFieldMeta;
import fi.muikku.plugins.material.fieldmeta.SelectFieldOptionMeta;
import fi.muikku.plugins.material.fieldmeta.SelectFieldMeta;
import fi.muikku.plugins.material.fieldmeta.TextFieldMeta;
import fi.muikku.plugins.material.fieldmeta.TextFieldRightAnswer;

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
    List<TextFieldRightAnswer> translatedAnswers = new ArrayList<>();
    for (fi.muikku.plugins.dnm.parser.content.RightAnswer rightAnswer : rightAnswers) {
      Boolean correct = rightAnswer.getPoints() != null && rightAnswer.getPoints() > 0; 
      translatedAnswers.add(new TextFieldRightAnswer(rightAnswer.getText(), true, false, correct));
    }
    return new TextFieldMeta(name, columns, translatedAnswers, hint);
  }

  public MemoFieldMeta translateMemoField(String name, Integer columns, Integer rows, String help, String hint) {
    return new MemoFieldMeta(name, columns, rows, help, hint, "" /* no example */);
  }

  private String generateUniqueName(List<SelectFieldOptionMeta> options) {
    int i = 0;
    String name = String.valueOf(i);
    for (int j = 0; j < options.size(); j++) {
      if (name.equals(options.get(j).getName())) {
        name = String.valueOf(++i);
        j = -1;
      }
    }
    return name;
  }
  
  public SelectFieldMeta translateOptionList(String name, String listType, List<OptionListOption> options) {
    List<SelectFieldOptionMeta> translatedOptions = new ArrayList<>();
    for (OptionListOption option : options) {
      translatedOptions.add(new SelectFieldOptionMeta(option.getName(), option.getPoints() != null && option.getPoints() > 0, option.getText()));
    }
    // Fix for bug #499; generate unique values for empty option names 
    for (SelectFieldOptionMeta translatedOption : translatedOptions) {
      if (StringUtils.isEmpty(translatedOption.getName())) {
        translatedOption.setName(generateUniqueName(translatedOptions));
      }
    }
    // Nexus:  dropdown | list | radio | radio_horz
    // Muikku: dropdown | list | radio-vertical | radio-horizontal
    String newListType = listType;
    if ("radio".equals(listType)) {
      newListType = "radio-vertical";
    }
    else if ("radio_horz".equals(listType)) {
      newListType = "radio-horizontal";
    }
    return new SelectFieldMeta(name, newListType, translatedOptions);
  }

  public MultiSelectFieldMeta translateChecklistField(String paramName, List<MultiSelectFieldOptionMeta> options) {
    List<MultiSelectFieldOptionMeta> translatedOptions = new ArrayList<>();
    for (MultiSelectFieldOptionMeta option : options) {
      translatedOptions.add(new MultiSelectFieldOptionMeta(option.getName(), option.getText(), option.getCorrect()));
    }
    return new MultiSelectFieldMeta(paramName, "checkbox-vertical", translatedOptions);
  }
  
  public ConnectFieldMeta translateConnectField(String name, List<ConnectFieldOption> options) {
    
    List<ConnectFieldOptionMeta> connectFieldOptionMetas = new ArrayList<ConnectFieldOptionMeta>();
    List<ConnectFieldOptionMeta> counterparts = new ArrayList<ConnectFieldOptionMeta>();;
    List<ConnectFieldConnectionMeta> connectFieldConnectionMetas = new ArrayList<>();
    
    for (int i = 0; i < options.size(); i++) {
      
      ConnectFieldOption option = options.get(i);
      String fieldName = String.valueOf(i+1);
      String counterpartName = getExcelStyleLetterIndex(i);

      if (StringUtils.length(option.getTerm()) > 255) {
        option.setTerm(option.getTerm().substring(0, 254));
      }
      if (StringUtils.length(option.getEquivalent()) > 255) {
        option.setEquivalent(option.getEquivalent().substring(0, 254));
      }
      
      connectFieldOptionMetas.add(new ConnectFieldOptionMeta(fieldName, option.getTerm()));
      counterparts.add(new ConnectFieldOptionMeta(counterpartName, option.getEquivalent()));
      connectFieldConnectionMetas.add(new ConnectFieldConnectionMeta(fieldName, option.getAnswer()));
    }
    
    return new ConnectFieldMeta(name, connectFieldOptionMetas, counterparts, connectFieldConnectionMetas);
  }
  
  public FileFieldMeta translateFileField(String name, String help, String hint) {
    return new FileFieldMeta(name, help, hint);
  }
  
}
