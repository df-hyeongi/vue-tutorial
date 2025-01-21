import { BaseMediaEventService } from "./base-media-event-service";
import { MediaUtils } from "./media-utils";

export class VideoEventService extends BaseMediaEventService {
  private interactionObserver = new InteractionObserver();
  private debounceTimeout: number | null = null;

  private debounce(callback: () => void, delay: number = 300) {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = setTimeout(() => {
      callback();
      this.debounceTimeout = null;
    }, delay);
  }

  createPlayEvent(video: HTMLVideoElement) {
    if (!this.isReadyMedia(video)) return

    this.updatePlayTime(video.currentTime)

    const result = {
      ...this.createObjectData(video),
      time: video.currentTime
    };
    console.log("result", result);
    return result;
  }

  createPauseEvent(video: HTMLMediaElement) {
    const isSeeking = video.seeking;
    // isSeeking: 재생 중에 탐색은 pause 이벤트 무시. 
    if (isSeeking && !this.isReadyMedia(video)) return

    this.updatePausePlayTime(video.currentTime)

    const result = {
      ...this.createObjectData(video),
      ...this.createResultData(video),
    };
    console.log("result", result);
  }

  createSeekedEvent(video: HTMLMediaElement) {
    if (!this.isReadyMedia(video)) return;

    if (!this.interactionObserver.observe()) return;

    const result = {
      ...this.createObjectData(video),
      ...this.createTimeFromTimeTo(video.currentTime)
    }
    // TODO: 추후 return으로 처리해야함
    console.log('seeking result', result)
  }

  createControlChangeEvent(video: HTMLMediaElement) {
    this.debounce(() => {
    const { speed, volume, fullScreen } = this.createContextData(video);
    const result = {
      ...this.createObjectData(video),
      speed,
      volume,
      fullScreen,
    };
    console.log("control change result", result);
    }, 300)
  }

  initPageIn(video: HTMLMediaElement) {
    this.initSessionStartTime();
    this.initCurrentMedia(video)
    const result = {
      ...this.createObjectData(video),
      ...this.createContextData(video),
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
    this.interactionObserver.disconnect();
    this.currentMedia = null;
    this.sessionStartTime = 0;
  }
}
