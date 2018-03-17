import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as html2canvas from 'html2canvas';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit{

  constructor( private el: ElementRef ){ }


  @ViewChild('videoPlayer') videoPlayer: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;

  video   : HTMLVideoElement;
  canvasEl: HTMLCanvasElement;
  ratio   : number;
  canvasWidth : number;
  canvasHeight: number;

  ngOnInit(){
    // setTimeout( () => this.takeScreen(), 5000) ;
  }


  ngAfterViewInit(){
    this.video    = this.el.nativeElement.querySelector('#videoPlayer');
    this.canvasEl = <HTMLCanvasElement>this.el.nativeElement.querySelector('#canvas');

    let ratio = 1.777;
    this.canvasWidth = 1180;
    this.canvasHeight = (this.canvasWidth/ratio);
  }


  takeScreen() {

    let ctx   = this.canvasEl.getContext( '2d' );
    this.canvasEl.width = this.canvasWidth;
    this.canvasEl.height = this.canvasHeight;
    ctx.fillRect( 0, 0, this.canvasWidth, this.canvasHeight );
    ctx.drawImage( this.video, 0, 0, this.canvasWidth, this.canvasHeight );
    let data = (<HTMLCanvasElement>this.canvasEl).toDataURL('image/jpeg')
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
    } ).then( res => res.json() )
       .then( res => console.log( res.outputs[0].data.concepts ) )
       .catch( err => console.log( err ) )
  }




}
