import { BaseMediaEventService } from "./base-media-event-service";
import { Debouncer } from "./debounce";
import { MediaUtils } from "./media-utils";

export class MediaEventService extends BaseMediaEventService {
  // play에서는 media.seeking 상태가 변하지 않음 
  createPlayEvent(media: HTMLMediaElement) {
    console.log('createPlayEvent', media.seeking)
    if (this.seeking) return

    this.timeFrom = this.playTime
    this.playTime = media.currentTime

    const result = {
      ...this.createObjectData(media),
      ...this.createContextData(media),
      ...this.createTimeData(media),
    };
    console.log("play", result);
    return result;
  }

  // pause에서는 media.seeking 상태가 변함
  createPauseEvent(media: HTMLMediaElement) {
    console.log('createPauseEvent', media.seeking)
    if (this.seeking || media.seeking) return

    this.timeFrom = media.currentTime
    this.pausePlayTime = media.currentTime

    const result = {
      ...this.createObjectData(media),
      ...this.createResultData(media),
      ...this.createPlayedSegmentsData(),
    };
    console.log("pause result", result);
  }

  createSeekedEvent(media: HTMLMediaElement) {
    Debouncer.debounce(() => {
      this.seeking = media.seeking
      const result = {
        ...this.createObjectData(media),
        ...this.createTimeFromTimeTo(media.currentTime)
      }
      // TODO: 추후 return으로 처리해야함
      // console.log('seeking result', result)
    }, 300)
  }

  createSeekingEvent(media: HTMLMediaElement) {
    this.seeking = media.seeking
  }

  createControlChangeEvent(media: HTMLMediaElement) {
    Debouncer.debounce(() => {
      const { speed, volume, fullScreen } = this.createContextData(media);
      const result = {
        ...this.createObjectData(media),
        speed,
        volume,
        fullScreen,
      };
      // console.log("control change result", result);
    }, 300)
  }

  initPageIn(media: HTMLMediaElement) {
    this.initSessionStartTime();
    this.initCurrentMedia(media)
    const result = {
      ...this.createObjectData(media),
      ...this.createContextData(media),
    };
    // console.log("initPageIn", result);
  }

  initPageOut() {
    if (this.currentMedia) {
      const result = {
        ...this.createObjectData(this.currentMedia),
        ...this.createResultData(this.currentMedia),
        "played-segments": MediaUtils.convertSegments(this.playedSegments),
      };
      // console.log('initPageOut', result)
      return result
    }
    this.currentMedia = null;
    this.sessionStartTime = 0;
  }
}
