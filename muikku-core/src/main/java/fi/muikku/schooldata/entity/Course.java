package fi.muikku.schooldata.entity;

import fi.tranquil.TranquilEntity;

@TranquilEntity
public interface Course {

  String getName();

  void setName(String name);

  String getDescription();

}