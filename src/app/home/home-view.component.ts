import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TransferState } from '../../modules/transfer-state/transfer-state';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import * as _ from 'lodash';

@Component({
  selector: 'home-view',
  templateUrl: 'home.component.html',
  styleUrls: ['home.css']
})
export class HomeView implements OnInit {
  public message: string;
  public upcomingMatches: any = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private transferState: TransferState, private http: Http) {}
  
  ngOnInit() {
    let me = this;
    this.message = 'Home Component content || non api static content';

    if (isPlatformServer(this.platformId)) {
      let headers = new Headers();
      this.createAuthorizationHeader(headers);
      this.http.post('https://cig-prod-api.azurewebsites.net/api/matches/schedules', {date: null, pageno:0, state:3, type:0}, {headers: headers})
        .subscribe(function(data: any) {
          const matches = JSON.parse(data.text());
          let uniqMatches = _.uniqBy(matches, 'md');
          me.upcomingMatches = _.map(uniqMatches, function(match, index) {
              let resultObj = {date: '', matches: []};
              resultObj.date = match.md;
              resultObj.matches = _.filter(matches, {md: match.md});
              return resultObj;
          });
          me.transferState.set("upcoming_matches", me.upcomingMatches);
          console.log(me.transferState.get("upcoming_matches"));
        });
    } else if (!_.isEmpty(me.transferState.get("upcoming_matches"))) {
      console.log(me.transferState.get("upcoming_matches"));
      me.upcomingMatches = me.transferState.get("upcoming_matches");
    }
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Token HHiQLYvZnkGqfD5xzxr/Sw'); 
  }

  getFlag(teamName) {
    let flagStr = ''
    // if (teamName === 'PAK') flagStr = 'https://s3-ap-southeast-1.amazonaws.com/cig-assets/Images/flags2.0/100x100/pakistan.png';
    // else if(teamName === 'SL') flagStr = 'https://s3-ap-southeast-1.amazonaws.com/cig-assets/Images/flags2.0/100x100/srilanka.png';
    // else if(teamName === 'SA') flagStr = 'https://s3-ap-southeast-1.amazonaws.com/cig-assets/Images/flags2.0/100x100/southafrica.png';
    // else if(teamName === 'AUS') flagStr = 'https://s3-ap-southeast-1.amazonaws.com/cig-assets/Images/flags2.0/100x100/australia.png';
    // else if(teamName === 'BAN') flagStr = 'https://s3-ap-southeast-1.amazonaws.com/cig-assets/Images/flags2.0/100x100/bangladesh.png';
    // else if(teamName === 'WI') flagStr = 'https://s3-ap-southeast-1.amazonaws.com/cig-assets/Images/flags2.0/100x100/westindies.png';
    // else if(teamName === 'NZ') flagStr = 'https://s3-ap-southeast-1.amazonaws.com/cig-assets/Images/flags2.0/100x100/newzealand.png';
    // else if(teamName === 'ENG') flagStr = 'https://s3-ap-southeast-1.amazonaws.com/cig-assets/Images/flags2.0/100x100/england.png';
    // else if(teamName === 'IND') flagStr = 'https://s3-ap-southeast-1.amazonaws.com/cig-assets/Images/flags2.0/100x100/india.png';
    // else if(teamName === 'ZIM') flagStr = 'https://s3-ap-southeast-1.amazonaws.com/cig-assets/Images/flags2.0/100x100/zimbawe.png';

    return flagStr;
  }
}
