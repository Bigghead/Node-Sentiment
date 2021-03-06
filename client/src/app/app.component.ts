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
  }


  ngAfterViewInit(){
    this.video    = this.el.nativeElement.querySelector('#videoPlayer');
    this.canvasEl = <HTMLCanvasElement>this.el.nativeElement.querySelector('#canvas');

    let ratio = 1.6;
    this.canvasEl.width = 1180;
    this.canvasEl.height = (this.canvasEl.width/ratio);
  }


  takeScreen() {

    let ctx   = this.canvasEl.getContext( '2d' );
    ctx.fillRect( 0, 0, this.canvasEl.width, this.canvasEl.height );
    ctx.drawImage( this.video, 0, 0, this.canvasEl.width, this.canvasEl.height );
    let data = this.canvasEl.toDataURL('image/jpeg')
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
       .then( res => console.log( res ) )
      // ===== clairfai ===== //
      //  .then( res => console.log( res.outputs[0].data.concepts ) )
       .catch( err => console.log( err ) )
  }




}
