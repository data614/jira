import { enableStaticRendering } from "mobx-react";
// stores
import { IInstanceStore, InstanceStore } from "./instance.store";
import { IThemeStore, ThemeStore } from "./theme.store";
import { IUserStore, UserStore } from "./user.store";
import { IWorkspaceStore, WorkspaceStore } from "./workspace.store";

enableStaticRendering(typeof window === "undefined");

type HydrationData = {
  theme?: Parameters<IThemeStore["hydrate"]>[0];
  instance?: Parameters<IInstanceStore["hydrate"]>[0];
  user?: Parameters<IUserStore["hydrate"]>[0];
  workspace?: Parameters<IWorkspaceStore["hydrate"]>[0];
};

export abstract class CoreRootStore {
  theme: IThemeStore;
  instance: IInstanceStore;
  user: IUserStore;
  workspace: IWorkspaceStore;

  constructor() {
    this.theme = new ThemeStore(this);
    this.instance = new InstanceStore(this);
    this.user = new UserStore(this);
    this.workspace = new WorkspaceStore(this);
  }

  hydrate(initialData: HydrationData) {
    this.theme.hydrate(initialData.theme);
    this.instance.hydrate(initialData.instance);
    this.user.hydrate(initialData.user);
    this.workspace.hydrate(initialData.workspace);
  }

  resetOnSignOut() {
    localStorage.setItem("theme", "system");
    this.instance = new InstanceStore(this);
    this.user = new UserStore(this);
    this.theme = new ThemeStore(this);
    this.workspace = new WorkspaceStore(this);
  }
}
