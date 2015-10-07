package fi.muikku.controller;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import fi.muikku.dao.base.TagDAO;
import fi.muikku.model.base.Tag;

public class TagController {

  @Inject
  private TagDAO tagDAO;
  
  public Tag createTag(String text) {
    return tagDAO.create(text);
  }
  
  public List<Tag> searchTags(String searchText) {
    List<Tag> tags = tagDAO.listAll();
    List<Tag> filtered = new ArrayList<Tag>();
    searchText = searchText.toLowerCase();
    
    for (Tag t : tags) {
      if (t.getText().toLowerCase().contains(searchText))
        filtered.add(t);
    }
    
    return filtered;
  }

  public Tag findTag(String t) {
    return tagDAO.findByText(t);
  }
  
  public Tag findTagById(Long id) {
    return tagDAO.findById(id);
  }
}
