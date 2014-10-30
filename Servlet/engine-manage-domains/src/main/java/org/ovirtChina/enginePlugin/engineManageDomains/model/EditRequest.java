package org.ovirtChina.enginePlugin.engineManageDomains.model;

public class EditRequest {

  private String fieldToEdit;

  public EditRequest(){
    this.fieldToEdit="";
  }
  public EditRequest(String fieldToEdit){
    this.fieldToEdit=fieldToEdit;
  }
  public String getFieldToEdit() {
    return fieldToEdit;
  }

  @Override
  public String toString() {
    return new StringBuffer(" Field to Edit : ").append(this.fieldToEdit).toString();
  }

}
