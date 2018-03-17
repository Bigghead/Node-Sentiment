import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  img = '';
  @ViewChild('canvas') canvas: ElementRef;

  constructor( private el: ElementRef){

  }


  ngOnInit(){
    setTimeout( () => this.run(), 3000) ;
  }

  run() {

    let video = document.getElementsByTagName('video')[0];
    let canvas = <HTMLCanvasElement>document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    let ratio = video.videoWidth/video.videoHeight;
    let w = video.videoWidth-100;
    let h = (w/ratio);
    canvas.width = w;
    canvas.height = h;
    ctx.fillRect(0,0,w,h);
    ctx.drawImage(video,0,0,w,h);
    let data = (<HTMLCanvasElement>canvas).toDataURL('image/jpg')
    fetch( '/read', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        image: data
    })
    } ).then( res => res.json())
       .then( res => console.log( res ) )
       .catch( err => console.log( err ) )
    
    // video.style.backgroundImage = "url("+canvas.toDataURL()+")";
    // html2canvas(video).then(function(canvas) {
    // document.body.appendChild(canvas);})
    
    // html2canvas(video, { allowTaint: true } )
    //     .then( canvas => {
    //       console.log( canvas )
    //       let data = (<HTMLCanvasElement>canvas).toDataURL('image/jpg')
    //       // this.img = data;
    //       var doc = new jsPDF();
    //       doc.addImage(data,'JPEG',0,0);
    //       doc.save('test.pdf');
    //     } ) 
}




}
