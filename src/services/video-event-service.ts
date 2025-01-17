import { BaseMediaEventService } from "./base-media-event-service";
import { MediaUtils } from "./media-utils";

export class VideoEventService extends BaseMediaEventService {
  private initializeSessionStartTime(): void {
    if (!this.sessionStartTime) {
      this.sessionStartTime = Date.now();
    }
  }
  createPlayEvent(video: HTMLVideoElement): {
    "file-name": string; // 파일 이름
    mediaUrl: string; // 미디어 URL
    time: number; // media의 현재 시간 위치. 소수점 둘째 자리까지 나타낸다(아래 소수점 버림).
    "media-session-id": string;
    length: number; // media의 실제 길이(초 단위). 소수점 둘째 자리까지 나타낸다(아래 소수점 버림).
    format: string; // media의 파일 형식 (ex. mp4 등)
    speed: string; // media의 재생 속도. 정상 속도에 대한 배율을 의미하는 'x'와 함께 10진수 또는 정수값으로 표시한다. 음수 값은 되감기(rewind)를 의미하며, 양수 값은 빨리감기(fast forward)를 의미한다. 값이 1x 미만인 양수 값은 슬로우 모션 재생을 의미한다.
    volume: number; // media 개체에 지정된 소리의 크기. 0~1 사이 값을 사용하며 소수점 둘째 자리까지 나타낸다(아래 소수점 버림).
    "full-screen": boolean; // video가 전체 화면 모드로 재생되는 것을 식별하는 데에 사용한다.
  } {
    this.initializeSessionStartTime();

    this.currentPlayTime = MediaUtils.utilFloorToDecimals(video.currentTime);

    const isFullScreen = !!(
      document.fullscreenElement === video || (document as any).webkitFullscreenElement === video
    );

    const mediaSessionId = "438109af-ea37-4dbb-8df0-d9d1bbd9d5c2";

    const { fileName, mediaUrl, format, length, speed, volume } =
      MediaUtils.createCommonInfo(video);

    const result = {
      "file-name": fileName,
      mediaUrl: mediaUrl,
      time: this.currentPlayTime,
      "media-session-id": mediaSessionId,
      length,
      format,
      speed,
      volume,
      "full-screen": isFullScreen,
    };
    console.log("result", result);
    return result;
  }

  createPauseEvent(video: HTMLVideoElement) {
    const isEnded = video.ended;
    const isPaused = video.paused;
    if (isEnded || isPaused) {
      this.appendPlayedSegments(this.playedSegments, [
        this.currentPlayTime,
        MediaUtils.utilFloorToDecimals(video.currentTime),
      ]);

      this.currentPlayTime = MediaUtils.utilFloorToDecimals(video.currentTime);
      const result = {
        duration: MediaUtils.calculateSessionDuration(this.sessionStartTime, Date.now()),
        time: MediaUtils.utilFloorToDecimals(video.currentTime),
        progress:
          video.duration > 0 ? Math.floor((video.currentTime / video.duration) * 100) / 100 : 0,
        "played-segments": MediaUtils.convertSegments(this.playedSegments),
      };
      // TODO: 추후 return으로 처리해야함
      console.log("result", result);
    }
  }

  createSeekedEvent(video: HTMLVideoElement) {
    const currentTime = video.currentTime;

    // 상태 업데이트와 결과 생성 로직을 하나의 함수로 묶어 호출합니다.
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

  initPageIn(video: HTMLMediaElement) {}
  initPageOut(video: HTMLMediaElement) {}
}
