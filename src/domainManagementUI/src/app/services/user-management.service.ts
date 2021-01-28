import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

//Local Service Imports
import { environment } from 'src/environments/environment';
import { SettingsService } from 'src/app/services/settings.service';

//Models
import { UserModel } from 'src/app/models/user.model';

const headers = {
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
};

@Injectable()
export class UserManagementService {
  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) { }

    getAllUsers(){
        const url = `${this.settingsService.settings.apiUrl}/api/users/`;
        return this.http.get(url, headers);
    }

    getAllGroups(){
        const url = `${this.settingsService.settings.apiUrl}/api/users/groups/`;
        return this.http.get(url, headers);
    }

    getUser(username){
        const url = `${this.settingsService.settings.apiUrl}/api/user/${username}`;
        return this.http.get(url, headers);
    }

    addUser(user: UserModel){
        const url = `${this.settingsService.settings.apiUrl}/api/user/${user._id}`;
        return this.http.post(url, user);
    }
    
    updateUser(user: UserModel){
        const url = `${this.settingsService.settings.apiUrl}/api/user/${user._id}`;
        return this.http.put(url, user);
    }

    deleteUser(user_id){
        const url = `${this.settingsService.settings.apiUrl}/api/user/${user_id}`;
        return this.http.delete(url, headers);
    }
    
    confirmUser(username){
        const url = `${this.settingsService.settings.apiUrl}/api/user/${username}/confirm`;
        return this.http.get(url, headers);
    }
    
    setUserAsAdmin(username){
        const url = `${this.settingsService.settings.apiUrl}/api/user/${username}/admin`;
        return this.http.get(url, headers);
    }
    
    removeUserAsAdmin(username){
        const url = `${this.settingsService.settings.apiUrl}/api/user/${username}/admin`;
        return this.http.delete(url, headers);
    }

}
