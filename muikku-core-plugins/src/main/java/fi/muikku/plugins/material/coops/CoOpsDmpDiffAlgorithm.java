package fi.muikku.plugins.material.coops;

import java.util.LinkedList;

import com.sksamuel.diffpatch.DiffMatchPatch;
import com.sksamuel.diffpatch.DiffMatchPatch.Patch;

import fi.foyt.coops.CoOpsConflictException;

public class CoOpsDmpDiffAlgorithm implements CoOpsDiffAlgorithm {

  @Override
  public String getName() {
    return "dmp";
  }

  @Override
  public String patch(String data, String patch) throws CoOpsConflictException {
    DiffMatchPatch diffMatchPatch = new DiffMatchPatch();
    LinkedList<Patch> patches = new LinkedList<Patch>(diffMatchPatch.patch_fromText(patch));
    Object[] patchResult = diffMatchPatch.patch_apply(patches, data);
    
    for (boolean applied : (boolean[]) patchResult[1]) {
      if (!applied) {
        throw new CoOpsConflictException();
      }
    }

    return (String) patchResult[0];
  }

}
