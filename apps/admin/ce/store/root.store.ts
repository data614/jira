import { enableStaticRendering } from "mobx-react";
// stores
import { CoreRootStore } from "@/store/root.store";

enableStaticRendering(typeof window === "undefined");

export class RootStore extends CoreRootStore {
  constructor() {
    super();
  }

  hydrate(initialData: Parameters<CoreRootStore["hydrate"]>[0]) {
    super.hydrate(initialData);
  }

  resetOnSignOut() {
    super.resetOnSignOut();
  }
}
