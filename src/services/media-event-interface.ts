export interface MediaEvent {
  initPageIn(media: HTMLMediaElement): any;
  initPageOut(media: HTMLMediaElement): any;
  createPlayEvent(media: HTMLMediaElement): any;
  createPauseEvent(media: HTMLMediaElement): any;
  createSeekedEvent(media: HTMLMediaElement): any;
  createSeekingEvent(media: HTMLMediaElement): any;
  createControlChangeEvent(media: HTMLMediaElement): any;
  watchCanPlayEvent(canPlay: boolean): any;
  watchEnded(ended: boolean): any;
}

