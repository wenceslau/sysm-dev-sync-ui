import {Component, effect, inject} from '@angular/core';
import {SignalApp} from '../../../services/signal-app';
import {AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {HttpApp, RequestData} from '../../../services/http-app';
import {User, Workspace} from '../../../application/objects';

@Component({
  selector: 'app-workspace-add-member',
  standalone: false,
  templateUrl: './workspace-add-member.html',
  styleUrl: './workspace-add-member.scss'
})
export class WorkspaceAddMember {

  private workspacePath: string = "/workspaces";
  private userPath: string = "/users";

  protected signalApp = inject(SignalApp);
  private httpApp = inject(HttpApp);

  protected selectedMember: User | null = null;
  protected selectedMemberWorkspace: User | null = null;
  protected selectedWorkspace: Workspace | null = null;
  protected header = 'New Workspace';
  protected visible: boolean = false;
  protected deleteClicked = true;
  protected isDeleting = false;
  protected isSaving = false;

  protected users: User[] = [];
  protected userSuggested: User[] = [];

  constructor() {
    effect(() => {
      this.selectedWorkspace = this.signalApp.selectedWorkspace();
      this.visible = this.signalApp.showWorkspaceAddMember();
      if (this.visible) {
        this.deleteClicked = false;
        this.selectedMember = null;
        this.loadUsers();
      }

    });
  }

  protected prepareDelete(member: User) {
    this.selectedMemberWorkspace = member;
    this.deleteClicked = true;
  }

  protected listBoxOptions(): any[] {
    if (this.selectedWorkspace) {
      return this.selectedWorkspace.members
    }
    return []
  }

  protected closeDialog() {
    this.signalApp.showWorkspaceAddMember.set(false);
    this.signalApp.selectedWorkspace.set(null);
    this.signalApp.refreshWorkspace.set(true);
  }

  // Event handlers
  protected onSearch(event: AutoCompleteCompleteEvent) {
    this.userSuggested = this.users.filter(user => user.name?.toLowerCase().includes(event.query.toLowerCase()));
  }

  // Async functions
  protected async addMember() {

    this.isSaving = true;

    try {
      //Add member to workspace
      let requestData = new RequestData(this.workspacePath + "/" + this.selectedWorkspace!.id + "/members/"+ this.selectedMember?.id);
      await this.httpApp.putAsync<void>(requestData);

      // Get updated workspace
      this.loadWorkspace();

      // Remove member from list
      this.users = this.users.filter(user => user.id !== this.selectedMember!.id);
      this.selectedMember = null;

      console.log(`Workspace ${this.selectedWorkspace!.name} updated with member ${this.selectedMember!.name}`)
    } catch (error) {
      console.error("Failed to save workspace", error);
    } finally {
      this.isSaving = false;
    }
  }

  protected async removeMember() {
    this.isDeleting = true;
    try {
      //Add member to workspace
      let requestData = new RequestData(this.workspacePath + "/" + this.selectedWorkspace!.id + "/members/" + this.selectedMemberWorkspace!.id);
      await this.httpApp.deleteAsync<void>(requestData);

      // Get updated workspace
      this.loadWorkspace();

      // Re-add member to list
      this.users.push(this.selectedMemberWorkspace!);
      this.selectedMemberWorkspace = null;

    } catch (error) {
      console.error("Failed to save workspace", error);
    } finally {
      this.deleteClicked = false;
      this.isDeleting = false;
    }
  }

  private async loadUsers() {
    let requestData = new RequestData(this.userPath + "/list");
    this.users = await this.httpApp.getAsync<User[]>(requestData);

    //remove from the users list the members exist on the selected workspace
    this.users = this.users.filter(user => !this.selectedWorkspace?.members.some(member => member.id === user.id));
  }

  private async loadWorkspace() {
    if (this.selectedWorkspace) {
      let requestData = new RequestData(this.workspacePath + "/" + this.selectedWorkspace.id);
      this.selectedWorkspace = await this.httpApp.getAsync(requestData);
    }
  }


}
