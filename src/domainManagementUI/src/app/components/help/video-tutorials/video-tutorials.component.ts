import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-tutorials',
  templateUrl: './video-tutorials.component.html',
  styleUrls: ['./video-tutorials.component.scss'],
})
export class VideoTutorialsComponent implements OnInit {
  applicationPlaylist = [
    {
      name: 'Add an Application',
      src: 'assets/videos/application_add.mp4',
    },
    {
      name: 'Delete an Application',
      src: 'assets/videos/application_delete.mp4',
    },
  ];

  domainPlaylist = [];

  templatePlaylist = [];

  userPlaylist = [
    {
      name: 'Register User',
      src: 'assets/videos/user_register.mp4',
    },
    {
      name: 'Confirm User',
      src: 'assets/videos/user_confirm.mp4',
    },
    {
      name: 'Disable/Delete User',
      src: 'assets/videos/user_disable_delete.mp4',
    },
    {
      name: 'Set User Applications',
      src: 'assets/videos/user_applications.mp4',
    },
    {
      name: 'Generate API Key',
      src: 'assets/videos/user_apikey.mp4',
    },
  ];

  currentVid = {
    src: '',
  };

  player: any;

  constructor() {}

  playVideo() {
    this.player.play();
  }

  selectVideo(video: any) {
    this.currentVid = video;
  }

  onPlayerReady(player: any) {
    this.player = player;
    this.player
      .getDefaultMedia()
      .subscriptions.loadedMetadata.subscribe(this.playVideo.bind(this));
  }

  ngOnInit(): void {}
}
