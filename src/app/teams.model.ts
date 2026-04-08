export class Teams {
    id?: number;
    teamName: string;
    teamLead: string;
    teamMembers: string[];
    description?: string;
    status?: string;

    constructor(
        teamName: string,
        teamLead: string,
        teamMembers: string[],
        description?: string,
        status?: string,
        id?: number
    ) {
        this.id = id;
        this.teamName = teamName;
        this.teamLead = teamLead;
        this.teamMembers = teamMembers;
        this.description = description || '';
        this.status = status || 'Active';
    }
}
