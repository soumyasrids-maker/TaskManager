import { Component, OnInit } from '@angular/core';
import { TeamsService } from '../teams.service';
import { Teams } from '../teams.model';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {

  // Teams data
  teams: Teams[] = [];
  filteredTeams: Teams[] = [];

  // Form data
  newTeam: Teams = new Teams('', '', [], '', 'Active');
  editingTeamId: number | null = null;
  isEditMode: boolean = false;

  // UI states
  showAddForm: boolean = false;
  showEditForm: boolean = false;
  searchQuery: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  // Pagination
  pageSize: number = 6;
  currentPage: number = 1;

  // Form validation
  showValidationErrors: boolean = false;

  constructor(private teamsService: TeamsService) { }

  ngOnInit(): void {
    this.loadAllTeams();
  }

  /**
   * Load all teams from backend
   */
  loadAllTeams(): void {
    this.isLoading = true;
    this.teamsService.getAllTeams().subscribe(
      (data: Teams[]) => {
        this.teams = data;
        this.filteredTeams = data;
        this.isLoading = false;
        console.log('Teams loaded successfully:', data);
      },
      (error) => {
        this.isLoading = false;
        this.handleError('Failed to load teams', error);
        console.error('Error loading teams:', error);
      }
    );
  }

  /**
   * Create a new team
   */
  createTeam(): void {
    if (!this.validateTeamForm()) {
      this.showValidationErrors = true;
      return;
    }

    this.isLoading = true;
    this.teamsService.createTeam(this.newTeam).subscribe(
      (response: Teams) => {
        this.teams.push(response);
        this.filteredTeams = this.teams;
        this.successMessage = `Team '${response.teamName}' created successfully!`;
        this.resetForm();
        this.isLoading = false;
        console.log('Team created:', response);
        setTimeout(() => this.successMessage = '', 3000);
      },
      (error) => {
        this.isLoading = false;
        if (error.status === 409) {
          this.errorMessage = 'Team name already exists!';
        } else {
          this.handleError('Failed to create team', error);
        }
        console.error('Error creating team:', error);
      }
    );
  }

  /**
   * Update an existing team
   */
  updateTeam(): void {
    if (!this.validateTeamForm()) {
      this.showValidationErrors = true;
      return;
    }

    if (this.editingTeamId === null) {
      this.errorMessage = 'No team selected for update';
      return;
    }

    this.isLoading = true;
    this.teamsService.updateTeam(this.editingTeamId, this.newTeam).subscribe(
      (response: Teams) => {
        const index = this.teams.findIndex(t => t.id === this.editingTeamId);
        if (index !== -1) {
          this.teams[index] = response;
          this.filteredTeams = this.teams;
        }
        this.successMessage = `Team '${response.teamName}' updated successfully!`;
        this.resetForm();
        this.isLoading = false;
        console.log('Team updated:', response);
        setTimeout(() => this.successMessage = '', 3000);
      },
      (error) => {
        this.isLoading = false;
        if (error.status === 404) {
          this.errorMessage = 'Team not found!';
        } else if (error.status === 409) {
          this.errorMessage = 'Team name already exists!';
        } else {
          this.handleError('Failed to update team', error);
        }
        console.error('Error updating team:', error);
      }
    );
  }

  /**
   * Delete a team
   */
  deleteTeam(id: number, teamName: string): void {
    if (!confirm(`Are you sure you want to delete team '${teamName}'?`)) {
      return;
    }

    this.isLoading = true;
    this.teamsService.deleteTeam(id).subscribe(
      () => {
        this.teams = this.teams.filter(t => t.id !== id);
        this.filteredTeams = this.teams;
        this.successMessage = `Team '${teamName}' deleted successfully!`;
        this.isLoading = false;
        console.log('Team deleted:', id);
        setTimeout(() => this.successMessage = '', 3000);
      },
      (error) => {
        this.isLoading = false;
        if (error.status === 404) {
          this.errorMessage = 'Team not found!';
        } else {
          this.handleError('Failed to delete team', error);
        }
        console.error('Error deleting team:', error);
      }
    );
  }

  /**
   * Get team by ID for editing
   */
  editTeam(id: number): void {
    const team = this.teams.find(t => t.id === id);
    if (team) {
      this.editingTeamId = id;
      this.newTeam = new Teams(
        team.teamName,
        team.teamLead,
        [...team.teamMembers],
        team.description,
        team.status,
        team.id
      );
      this.isEditMode = true;
      this.showEditForm = true;
      this.showAddForm = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Search teams by name or team lead
   */
  searchTeams(): void {
    if (!this.searchQuery.trim()) {
      this.filteredTeams = this.teams;
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredTeams = this.teams.filter(team =>
      team.teamName.toLowerCase().includes(query) ||
      team.teamLead.toLowerCase().includes(query) ||
      team.teamMembers.some(member =>
        member.toLowerCase().includes(query)
      )
    );
  }

  /**
   * Add a new member to team
   */
  addMemberToTeam(memberName: string): void {
    if (!memberName.trim()) {
      this.errorMessage = 'Please enter a member name';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    if (!this.newTeam.teamMembers) {
      this.newTeam.teamMembers = [];
    }

    if (this.newTeam.teamMembers.includes(memberName)) {
      this.errorMessage = 'Member already exists in this team';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    this.newTeam.teamMembers.push(memberName);
  }

  /**
   * Remove a member from team
   */
  removeMemberFromTeam(index: number): void {
    if (this.newTeam.teamMembers && this.newTeam.teamMembers.length > 0) {
      this.newTeam.teamMembers.splice(index, 1);
    }
  }

  /**
   * Toggle add form visibility
   */
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    this.showEditForm = false;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }

  /**
   * Toggle edit form visibility
   */
  toggleEditForm(): void {
    this.showEditForm = !this.showEditForm;
    if (!this.showEditForm) {
      this.resetForm();
    }
  }

  /**
   * Cancel form operations
   */
  cancelForm(): void {
    this.showAddForm = false;
    this.showEditForm = false;
    this.resetForm();
  }

  /**
   * Reset form data
   */
  resetForm(): void {
    this.newTeam = new Teams('', '', [], '', 'Active');
    this.editingTeamId = null;
    this.isEditMode = false;
    this.showValidationErrors = false;
  }

  /**
   * Validate team form
   */
  validateTeamForm(): boolean {
    return !!(
      this.newTeam.teamName &&
      this.newTeam.teamName.trim() &&
      this.newTeam.teamLead &&
      this.newTeam.teamLead.trim()
    );
  }

  /**
   * Handle errors and display appropriate messages
   */
  private handleError(message: string, error: any): void {
    console.error(message, error);
    if (error.error && error.error.message) {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage = message;
    }
    setTimeout(() => this.errorMessage = '', 3000);
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.errorMessage = '';
  }

  /**
   * Clear success message
   */
  clearSuccess(): void {
    this.successMessage = '';
  }

  /**
   * Get paginated teams
   */
  getPaginatedTeams(): Teams[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredTeams.slice(startIndex, startIndex + this.pageSize);
  }

  /**
   * Get total pages
   */
  getTotalPages(): number {
    return Math.ceil(this.filteredTeams.length / this.pageSize);
  }

  /**
   * Go to next page
   */
  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  /**
   * Go to previous page
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

}
