import {Component, effect, inject} from '@angular/core';
import {SignalsApp} from '../../../services/signals-app';
import {Workspace, WorkspaceClient} from '../../../services/clients/workspace-client';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User, UserClient} from '../../../services/clients/user-client';
import {AutoCompleteCompleteEvent} from 'primeng/autocomplete';

@Component({
  selector: 'app-workspace-add-member',
  standalone: false,
  templateUrl: './workspace-add-member.html',
  styleUrl: './workspace-add-member.scss'
})
export class WorkspaceAddMember {

  protected signalApp = inject(SignalsApp);
  private userClient = inject(UserClient);
  private workspaceClient = inject(WorkspaceClient);

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
      await this.workspaceClient.addMember(this.selectedWorkspace!.id, this.selectedMember!.id);

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
      await this.workspaceClient.removeMember(this.selectedWorkspace!.id, this.selectedMemberWorkspace!.id);

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
    this.users = await this.userClient.listAsync({}, "/list");

    //remove from the users list the members exist on the selected workspace
    this.users = this.users.filter(user => !this.selectedWorkspace?.members.some(member => member.id === user.id));
  }

  private async loadWorkspace() {
    if (this.selectedWorkspace) {
      this.selectedWorkspace = await this.workspaceClient.getByIdAsync(this.selectedWorkspace.id);
    }
  }


}
