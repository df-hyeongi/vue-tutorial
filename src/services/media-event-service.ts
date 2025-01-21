import { BaseMediaEventService } from "./base-media-event-service";
import { MediaUtils } from "./media-utils";
import { Debouncer } from "./debounce";

export class MediaEventService extends BaseMediaEventService {
  createPlayEvent(media: HTMLMediaElement) {
    if (!this.isReadyMedia(media)) return

    this.updatePlayTime(media.currentTime)

    const result = {
      ...this.createObjectData(media),
      time: media.currentTime
    };
    console.log("result", result);
    return result;
  }

  createPauseEvent(media: HTMLMediaElement) {
    const isSeeking = media.seeking;
    // isSeeking: 재생 중에 탐색은 pause 이벤트 무시. 
    if (isSeeking && !this.isReadyMedia(media)) return

    this.updatePausePlayTime(media.currentTime)

    const result = {
      ...this.createObjectData(media),
      ...this.createResultData(media),
    };
    console.log("result", result);
  }

  createSeekedEvent(media: HTMLMediaElement) {
    if (!this.isReadyMedia(media)) return;

    Debouncer.debounce(() => {
      const result = {
        ...this.createObjectData(media),
        ...this.createTimeFromTimeTo(media.currentTime)
      }
      // TODO: 추후 return으로 처리해야함
      console.log('seeking result', result)
    }, 300)
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
      console.log("control change result", result);
    }, 300)
  }

  initPageIn(media: HTMLMediaElement) {
    this.initSessionStartTime();
    this.initCurrentMedia(media)
    const result = {
      ...this.createObjectData(media),
      ...this.createContextData(media),
    };
    console.log("initPageIn", result);
  }

  initPageOut() {
    if (this.getCurrentMedia) {
      return {
        ...this.createObjectData(this.getCurrentMedia),
        ...this.createResultData(this.getCurrentMedia),
        "session-duration": MediaUtils.convertSegments(this.playedSegments),
      };
    }
    this.currentMedia = null;
    this.sessionStartTime = 0;
  }
}
