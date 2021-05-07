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

  domainPlaylist = [
    {
      name: 'Add a Domain',
      src: 'assets/videos/domain_add.mp4',
    },
    {
      name: 'Delete a Domain',
      src: 'assets/videos/domain_delete.mp4',
    },
    {
      name: "Set a Domain's Application",
      src: 'assets/videos/domain_set_application.mp4',
    },
    {
      name: "Approve a Domain's Content",
      src: 'assets/videos/domain_approve.mp4',
    },
    {
      name: "Download a Domain's Content",
      src: 'assets/videos/domain_download.mp4',
    },
    {
      name: 'Upload Content to Domain',
      src: 'assets/videos/domain_upload.mp4',
    },
    {
      name: 'Launch a Domain',
      src: 'assets/videos/domain_launch.mp4',
    },
    {
      name: 'Categorize a Domain',
      src: 'assets/videos/domain_categorize.mp4',
    },
  ];

  templatePlaylist = [
    {
      name: 'Add a Template',
      src: 'assets/videos/template_add.mp4',
    },
    {
      name: 'Approve a Template',
      src: 'assets/videos/template_approve.mp4',
    },
    {
      name: 'Download a Template',
      src: 'assets/videos/template_download.mp4',
    },
  ];

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
