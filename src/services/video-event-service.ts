import { BaseMediaEventService } from "./base-media-event-service";
import { MediaUtils } from "./media-utils";

export class VideoEventService extends BaseMediaEventService {
  private initializeSessionStartTime(): void {
    if (!this.sessionStartTime) {
      this.sessionStartTime = Date.now();
    }
  }

  createPlayEvent(video: HTMLVideoElement) {
    this.initializeSessionStartTime();

    this.currentPlayTime = MediaUtils.utilFloorToDecimals(video.currentTime);

    const result = {
      ...this.createObjectData(video),
      time: this.currentPlayTime,
    };
    console.log("result", result);
    return result;
  }

  createPauseEvent(video: HTMLMediaElement) {
    const isSeeking = video.seeking;
    // 탐색중에는 pause 이벤트 무시
    if (isSeeking) {
      return
    }
    const result = {
      ...this.createObjectData(video),
      ...this.createResultData(video),
      ...this.createPlayedSegments(video),
    };
    console.log("result", result);
  }

  createSeekingEvent(video: HTMLMediaElement) {
    const currentTime = video.currentTime;

    const result = this.updateTimeFromAndCreateResult(currentTime);
    // TODO: 추후 return으로 처리해야함
    console.log('result', result)
  }

  // TODO: createSeekedEvent에 맞는 결과값에 상응하는 함수명으로 수정하기
  private updateTimeFromAndCreateResult(currentTime: number) {
    const previousTimeFrom = this.timeFrom;
    this.timeFrom = currentTime;

    return {
      "time-from": MediaUtils.utilFloorToDecimals(previousTimeFrom),
      "time-to": MediaUtils.utilFloorToDecimals(currentTime),
    };
  }

  createControlChangeEvent(video: HTMLMediaElement) {
    const { speed, volume, fullScreen } = this.createContextData(video);
    const result = {
      ...this.createObjectData(video),
      speed,
      volume,
      fullScreen,
    };
    console.log("control change result", result);
  }

  initPageIn(video: HTMLMediaElement) {
    this.initializeSessionStartTime();
    this.currentMedia = video;
    const result = {
      ...this.createObjectData(video),
      ...this.createContextData(video),
    };
    console.log("initPageIn", result);
  }

  initPageOut() {
    if (this.currentMedia) {
      return {
        ...this.createObjectData(this.currentMedia),
        ...this.createResultData(this.currentMedia),
        "session-duration": MediaUtils.convertSegments(this.playedSegments),
      };
    }
    this.currentMedia = null;
    this.sessionStartTime = 0;
  }
}
