import { Component, OnInit, ViewChild } from '@angular/core';
/* import * as Peer from 'peerjs'; */
/* import Peer from 'peerjs'; */

declare var Peer: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'peerclientA';
  @ViewChild('videoStream') videoStream: any;
  id = 'peerclientA'; // for a time being we are providing peer id but in future we would need to use node server to create peer id for us
  peer;
  option = {
    host: 'localhost',
    port: 9000,
    path: '/peerjs'
  };
  ngOnInit() {
    this.peer = new Peer(this.id);
    setTimeout(() => { console.log(this.peer); }, 3000);
  }

  videocallToClient() {
    console.log('videocallToClient video Call pressed');
    const video = this.videoStream.nativeElement;
    navigator.getUserMedia = navigator.getUserMedia;
    navigator.getUserMedia({ video: true, audio: true }, (stream) => {
      const call = this.peer.call('peerclientB', stream);
      call.on('stream', (remoteStream) => {
        video.srcObject = remoteStream;
        video.play();
      });
    }, (err) => {
      console.log('Failed to get local stream', err);
    });
  }

  recieveVideoCall() {
    const video = this.videoStream.nativeElement;
    console.log('Inside Recieved call');
    navigator.getUserMedia = navigator.getUserMedia;  /* || navigator.webkitGetUserMedia || navigator.mozGetUserMedia; */
    this.peer.on('call', (call) => {
      navigator.getUserMedia({ video: true, audio: true }, (stream) => {
        call.answer(stream); // Answer the call with an A/V stream.
        call.on('stream', (remoteStream) => {
          video.srcObject = remoteStream;
          video.play();
          // Show stream in some video/canvas element.
        });
      }, (err) => {
        console.log('Failed to get local stream', err);
      });
    });
  }

}
