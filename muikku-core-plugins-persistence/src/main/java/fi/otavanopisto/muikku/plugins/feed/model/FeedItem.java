package fi.otavanopisto.muikku.plugins.feed.model;

import java.time.OffsetDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class FeedItem {
  
  public FeedItem() {
  }
  
  public FeedItem(
      String title,
      String link,
      String author,
      String description,
      OffsetDateTime publicationDate,
      String image,
      Feed feed
  ) {
    this.title = title;
    this.link = link;
    this.author = author;
    this.description = description;
    this.publicationDate = publicationDate;
    this.image = image;
    this.feed = feed;
  }

  public Long getId() {
    return id;
  }
  
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

  public OffsetDateTime getPublicationDate() {
    return publicationDate;
  }

  public void setPublicationDate(OffsetDateTime publicationDate) {
    this.publicationDate = publicationDate;
  }

  public String getImage() {
    return image;
  }

  public void setImage(String image) {
    this.image = image;
  }

  public Feed getFeed() {
    return feed;
  }

  public void setFeed(Feed feed) {
    this.feed = feed;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @JsonIgnore
  private Long id;
  
  @Column
  private String title;

  @Column
  private String link;

  @Column
  private String author;

  @Lob
  @Column
  private String description;

  @Column
  private OffsetDateTime publicationDate;

  @Column
  private String image;

  @ManyToOne(targetEntity = Feed.class, optional = false)
  @JsonIgnore
  private Feed feed;
}