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
    const result = this.createMediaEndEvent(video)
    console.log("result", result);
  }

  createSeekedEvent(video: HTMLVideoElement) {
    const currentTime = video.currentTime;

    // 상태 업데이트와 결과 생성 로직을 하나의 함수로 묶어 호출
    const result = this.updateTimeFromAndCreateResult(currentTime);
    // TODO: 추후 return으로 처리해야함
    console.log("Seeked Event", result);
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

  initPageIn(video: HTMLMediaElement) {
    this.initializeSessionStartTime();
    this.currentMedia = video;
    const result = {
      ...this.createObjectData(video),
      ...this.createContextData(video),
    }
    console.log("initPageIn", result);
  }

  initPageOut() {
    if (this.currentMedia) {
      return {
        ...this.createObjectData(this.currentMedia),
        ...this.createResultData(this.currentMedia),
        "session-duration": MediaUtils.convertSegments(this.playedSegments),
      }
    }
    this.currentMedia = null
    this.sessionStartTime = 0
  }
}
