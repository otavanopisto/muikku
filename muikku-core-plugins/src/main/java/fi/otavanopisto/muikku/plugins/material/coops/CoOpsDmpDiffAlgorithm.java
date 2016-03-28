package fi.otavanopisto.muikku.plugins.material.coops;

import java.util.LinkedList;

import com.sksamuel.diffpatch.DiffMatchPatch;
import com.sksamuel.diffpatch.DiffMatchPatch.Diff;
import com.sksamuel.diffpatch.DiffMatchPatch.Operation;
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
  
  @Override
  public String unpatch(String data, String patch) throws CoOpsConflictException {
    DiffMatchPatch diffMatchPatch = new DiffMatchPatch();
    LinkedList<Patch> patches = createUnpatch(new LinkedList<Patch>(diffMatchPatch.patch_fromText(patch)));

    Object[] patchResult = diffMatchPatch.patch_apply(patches, data);
    
    for (boolean applied : (boolean[]) patchResult[1]) {
      if (!applied) {
        throw new CoOpsConflictException();
      }
    }

    return (String) patchResult[0];
  }
  
  private LinkedList<Patch> createUnpatch(LinkedList<Patch> patches) {
    LinkedList<Patch> result = new LinkedList<>();
    
    // Switch places of DIFF_DELETE and DIFF_INSERT
    
    for (int patchIndex = 0, patchesLength = patches.size(); patchIndex < patchesLength; patchIndex++) {
      Patch patch = patches.get(patchIndex);
      Patch unpatch = new Patch();
      unpatch.length1 = patch.length1;
      unpatch.length2 = patch.length2;
      unpatch.start1 = patch.start1;
      unpatch.start2 = patch.start2;
      
      for (int diffIndex = 0, diffsLength = patch.diffs.size(); diffIndex < diffsLength; diffIndex++) {
        Diff diff = patch.diffs.get(diffIndex);
        switch (diff.operation) {
          case DELETE:
            patch.diffs.add(new Diff(Operation.INSERT, diff.text));
          break;
          case INSERT:
            patch.diffs.add(new Diff(Operation.DELETE, diff.text));
          break;
          case EQUAL:
            patch.diffs.add(new Diff(diff.operation, diff.text));
          break;
        }
      }
      
      result.add(unpatch);
    }
    
    return result;
  }

}
