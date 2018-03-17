import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as html2canvas from 'html2canvas';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{

  constructor( private el: ElementRef ){ }


  @ViewChild('videoPlayer') videoPlayer: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;


  ngOnInit(){
    // setTimeout( () => this.takeScreen(), 5000) ;
  }


  takeScreen() {
    let video = this.el.nativeElement.querySelector('#videoPlayer');
    let canvas = <HTMLCanvasElement>this.el.nativeElement.querySelector('#canvas');
    let ctx = canvas.getContext('2d');
    let ratio = video.videoWidth/video.videoHeight;
    let w = video.videoWidth-100;
    let h = (w/ratio);
    canvas.width = w;
    canvas.height = h;
    ctx.fillRect(0,0,w,h);
    ctx.drawImage(video,0,0,w,h);
    let data = (<HTMLCanvasElement>canvas).toDataURL('image/jpeg')
    this.parseImage( data );
}


  parseImage( image: string ) {
    fetch( '/read', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        image
    })
    } ).then( res => res.json())
       .then( res => console.log( res.outputs[0].data.concepts ) )
       .catch( err => console.log( err ) )
  }




}
