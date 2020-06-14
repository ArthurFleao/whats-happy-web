import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import * as moment from 'moment';
import { Subject, Observable } from 'rxjs';
import { SnackService } from 'src/app/services/snack.service';

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.scss']
})
export class RecorderComponent implements OnInit {
  @Input()
  disableButtons;
  private stream;
  recorder;
  private interval;
  private startTime;
  private _recorded = new Subject<any>();
  recordingTime = new Subject<string>();
  status;
  private _recordingFailed = new Subject<string>();

  @Output()
  recorded = new EventEmitter<any>();
  constructor(
    private snack: SnackService,
  ) { }

  ngOnInit(): void {
  }

  startRecording() {

    if (this.recorder) {
      // It means recording is already started or it is already recording something
      return;
    }

    this.recordingTime.next('00:00');
    this.status = 'pediu permissão';
    navigator.mediaDevices.getUserMedia({ audio: true }).then(s => {
      this.status = 'aceitou permissão';
      this.stream = s;
      this.record();
    }).catch(error => {
      this._recordingFailed.next();
    });

  }

  private record() {

    this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
      type: 'audio',
      mimeType: 'audio/wav',
      numberOfAudioChannels: 1,
    });

    this.status = 'gravando';
    this.recorder.record();
    this.startTime = moment();
    this.interval = setInterval(
      () => {
        const currentTime = moment();
        const diffTime = moment.duration(currentTime.diff(this.startTime));
        const time = this.toString(diffTime.minutes()) + ':' + this.toString(diffTime.seconds());

        this.recordingTime.next(time);
        if (diffTime.asSeconds() > 60) {
          this.snack.warning('Estamos limitando o audio à 1 minuto neste protótipo devido aos custos da conversão para texto.');
          this.stopRecording();
        }
      },
      1000
    );
  }

  private toString(value) {
    let val = value;
    if (!value) {
      val = '00';
    }
    if (value < 10) {
      val = '0' + value;
    }
    return val;
  }

  stopRecording() {

    if (this.recorder) {
      this.recorder.stop((blob) => {
        if (this.startTime) {
          const wavName = encodeURIComponent('audio_' + new Date().getTime() + '.wav');
          this.stopMedia();
          const audio = { blob, title: wavName };
          this.status = 'gravado';
          this._recorded.next(audio);
          this.recorded.emit(audio);
        }
      }, () => {
        this.stopMedia();
        this._recordingFailed.next();
      });
    }

  }

  private stopMedia() {
    if (this.recorder) {
      this.recorder = null;
      clearInterval(this.interval);
      this.startTime = null;
      if (this.stream) {
        this.stream.getAudioTracks().forEach(track => track.stop());
        this.stream = null;
      }
    }
  }

  abortRecording() {
    this.stopMedia();
  }

}
