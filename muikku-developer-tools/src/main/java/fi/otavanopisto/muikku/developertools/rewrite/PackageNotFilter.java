package fi.otavanopisto.muikku.developertools.rewrite;

import java.util.List;

import org.ocpsoft.rewrite.annotation.scan.PackageFilter;

public class PackageNotFilter extends PackageFilter {

  public PackageNotFilter(String config, List<String> notPackages) {
    super(config);
    this.notPackages = notPackages;
  }  

  @Override
  public boolean isAllowedPackage(String packageName) {
    if (notPackages.contains(packageName)) {
      return false;
    }
    
    return super.isAllowedPackage(packageName);
  }
  
  private List<String> notPackages;
}

