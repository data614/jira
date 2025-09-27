import { action, observable, runInAction, makeObservable } from "mobx";
// plane internal packages
import { EUserStatus, TUserStatus } from "@plane/constants";
import { AuthService, UserService } from "@plane/services";
import { IUser } from "@plane/types";
// root store
import { CoreRootStore } from "@/store/root.store";

type ServiceError = { status?: number; message?: string };

const isServiceError = (error: unknown): error is ServiceError =>
  typeof error === "object" && error !== null && ("status" in error || "message" in error);

export interface IUserStore {
  // observables
  isLoading: boolean;
  userStatus: TUserStatus | undefined;
  isUserLoggedIn: boolean | undefined;
  currentUser: IUser | undefined;
  // fetch actions
  hydrate: (data: IUser | undefined) => void;
  fetchCurrentUser: () => Promise<IUser>;
  reset: () => void;
  signOut: () => void;
}

export class UserStore implements IUserStore {
  // observables
  isLoading: boolean = true;
  userStatus: TUserStatus | undefined = undefined;
  isUserLoggedIn: boolean | undefined = undefined;
  currentUser: IUser | undefined = undefined;
  // services
  private readonly userService: UserService;
  private readonly authService: AuthService;

  constructor(private store: CoreRootStore) {
    makeObservable(this, {
      // observables
      isLoading: observable.ref,
      userStatus: observable,
      isUserLoggedIn: observable.ref,
      currentUser: observable,
      // action
      fetchCurrentUser: action,
      reset: action,
      signOut: action,
    });
    this.userService = new UserService();
    this.authService = new AuthService();
  }

  hydrate = (data?: IUser) => {
    if (data) this.currentUser = data;
  };

  /**
   * @description Fetches the current user
   * @returns Promise<IUser>
   */
  fetchCurrentUser = async () => {
    try {
      if (this.currentUser === undefined) this.isLoading = true;
      const currentUser = await this.userService.adminDetails();
      if (currentUser) {
        await this.store.instance.fetchInstanceAdmins();
        runInAction(() => {
          this.isUserLoggedIn = true;
          this.currentUser = currentUser;
          this.isLoading = false;
        });
      } else {
        runInAction(() => {
          this.isUserLoggedIn = false;
          this.currentUser = undefined;
          this.isLoading = false;
        });
      }
      return currentUser;
    } catch (error) {
      this.isLoading = false;
      this.isUserLoggedIn = false;
      const message = isServiceError(error) && typeof error.message === "string" ? error.message : "";
      if (isServiceError(error) && error.status === 403)
        this.userStatus = {
          status: EUserStatus.AUTHENTICATION_NOT_DONE,
          message,
        };
      else
        this.userStatus = {
          status: EUserStatus.ERROR,
          message,
        };
      throw error;
    }
  };

  reset = async () => {
    this.isUserLoggedIn = false;
    this.currentUser = undefined;
    this.isLoading = false;
    this.userStatus = undefined;
  };

  signOut = async () => {
    this.store.resetOnSignOut();
  };
}
