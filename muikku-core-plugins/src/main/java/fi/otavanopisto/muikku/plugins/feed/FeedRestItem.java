package fi.otavanopisto.muikku.plugins.feed;

import java.util.Date;

public class FeedRestItem {

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getLink() {
    return link;
  }

  public void setLink(String link) {
    this.link = link;
  }

  public String getAuthor() {
    return author;
  }

  public void setAuthor(String author) {
    this.author = author;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Date getPublicationDate() {
    return publicationDate;
  }

  public void setPublicationDate(Date publicationDate) {
    this.publicationDate = publicationDate;
  }

  public String getImage() {
    return image;
  }

  public void setImage(String image) {
    this.image = image;
  }

  public String getFeed() {
    return feed;
  }

  public void setFeed(String feed) {
    this.feed = feed;
  }

  private String title;
  private String link;
  private String author;
  private String description;
  private Date publicationDate;
  private String image;
  private String feed;

}
