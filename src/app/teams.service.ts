import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Teams } from './teams.model';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigurationService
  ) {
    this.apiUrl = this.configService.getBackendUrl() + '/api/teams';
  }

  /**
   * CREATE - Add a new team
   * @param team - Team object to create
   * @returns Observable<Teams>
   */
  createTeam(team: Teams): Observable<Teams> {
    return this.http.post<Teams>(this.apiUrl, team);
  }

  /**
   * READ - Get all teams
   * @returns Observable<Teams[]>
   */
  getAllTeams(): Observable<Teams[]> {
    return this.http.get<Teams[]>(this.apiUrl);
  }

  /**
   * READ - Get a team by ID
   * @param id - Team ID
   * @returns Observable<Teams>
   */
  getTeamById(id: number): Observable<Teams> {
    return this.http.get<Teams>(`${this.apiUrl}/${id}`);
  }

  /**
   * READ - Get a team by team name
   * @param teamName - Team name
   * @returns Observable<Teams>
   */
  getTeamByName(teamName: string): Observable<Teams> {
    return this.http.get<Teams>(`${this.apiUrl}/search/name/${teamName}`);
  }

  /**
   * READ - Get a team by team lead
   * @param teamLead - Team lead name
   * @returns Observable<Teams>
   */
  getTeamByLead(teamLead: string): Observable<Teams> {
    return this.http.get<Teams>(`${this.apiUrl}/search/lead/${teamLead}`);
  }

  /**
   * UPDATE - Update an existing team
   * @param id - Team ID
   * @param team - Updated team object
   * @returns Observable<Teams>
   */
  updateTeam(id: number, team: Teams): Observable<Teams> {
    return this.http.put<Teams>(`${this.apiUrl}/${id}`, team);
  }

  /**
   * DELETE - Delete a team
   * @param id - Team ID
   * @returns Observable<void>
   */
  deleteTeam(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * ADD - Add a member to a team
   * @param id - Team ID
   * @param memberName - Member name to add
   * @returns Observable<Teams>
   */
  addMemberToTeam(id: number, memberName: string): Observable<Teams> {
    return this.http.post<Teams>(`${this.apiUrl}/${id}/members`, memberName);
  }

  /**
   * REMOVE - Remove a member from a team
   * @param id - Team ID
   * @param memberName - Member name to remove
   * @returns Observable<Teams>
   */
  removeMemberFromTeam(id: number, memberName: string): Observable<Teams> {
    return this.http.delete<Teams>(`${this.apiUrl}/${id}/members/${memberName}`);
  }
}
