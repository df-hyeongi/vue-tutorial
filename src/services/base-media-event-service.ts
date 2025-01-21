import type { MediaEvent } from "./media-event-interface";
import { MediaUtils } from "./media-utils";

export abstract class BaseMediaEventService implements MediaEvent {
  // TODO: 전역으로 사용되는 변수들 최대한 제거해서 구현
  protected currentMedia: HTMLMediaElement | null = null;
  protected sessionStartTime = 0;
  protected playTime = 0;
  protected pausePlayTime = 0;
  protected timeFrom = 0;
  protected playedSegments: [number, number][] = [];

  protected initSessionStartTime(): void {
    if (!this.sessionStartTime) {
      this.sessionStartTime = Date.now();
    }
  }

  /**
   * init시에 담는 media 객체
   * @param media 
   */
  protected initCurrentMedia(media: HTMLMediaElement) {
    this.currentMedia = media
  }

  /**
   * 현재 담은 media 반환
   * @returns
   */
  protected get getCurrentMedia() {
    return this.currentMedia
  }

  /**
   * 마지막 재생 시간 업데이트
   * @param media
   * @returns
   */
  protected updatePlayTime(time: number) {
    this.playTime = MediaUtils.utilFloorToDecimals(time);
  }

  /**
   * pause시 플레이타임 업데이트
   * @param media
   * @returns
   */
  protected updatePausePlayTime(time: number) {
    this.pausePlayTime = MediaUtils.utilFloorToDecimals(time);
  }

  /**
   * 탐색 시작 시간 업데이트
   * @param currentTime 
   */
  protected updateTimefrom(currentTime: number) {
    this.timeFrom = MediaUtils.utilFloorToDecimals(currentTime)
  }

  /**
   * 재생 구간을 추적하고 새로운 세그먼트 배열을 반환
   * @param playedSegments 기존 재생 구간 배열
   * @param lastPlayTime 이전 재생 시간
   * @param currentTime 현재 재생 시간
   * @returns 업데이트된 세그먼트 배열
   */
  protected addPlayedSegment(playedSegments: [number, number][], lastPlayTime: number, currentTime: number): [number, number][] {
    const newSegment: [number, number] = [
      lastPlayTime,
      MediaUtils.utilFloorToDecimals(currentTime),
    ];

    return [...playedSegments, newSegment];
  }

  /**
   * 재생된 구간 업데이트
   * @param currentTime 현재 재생 시간
   */
  protected updatePlayedSegments(): void {
    const playedSegments = this.addPlayedSegment(
      this.playedSegments,
      this.playTime,
      this.pausePlayTime
    );
    this.playedSegments = playedSegments;
  }

  // TODO: createSeekedEvent에 맞는 결과값에 상응하는 함수명으로 수정하기
  protected createTimeFromTimeTo(currentTime: number) {
    this.updateTimefrom(currentTime)

    return {
      "time-from": MediaUtils.utilFloorToDecimals(this.playTime),
      "time-to": MediaUtils.utilFloorToDecimals(currentTime),
    };
  }

  /**
   * 미디어 준비 상태 확인
   * https://developer.mozilla.org/ko/docs/Web/API/HTMLMediaElement/readyState
   * @param media 
   * @returns 
   */
  protected isReadyMedia(media: HTMLMediaElement) {
    return media.readyState > 2;
  }

  /**
   * object 데이터 생성
   * @param media
   * @returns
   */
  protected createObjectData(media: HTMLMediaElement) {
    const mediaUrl = media.currentSrc || media.src;
    const fileName = MediaUtils.utilMediaFileName(mediaUrl);
    const mediaSessionId = "438109af-ea37-4dbb-8df0-d9d1bbd9d5c2";

    return {
      fileName,
      mediaUrl,
      mediaSessionId,
    };
  }

  /**
   * result 데이터 생성
   * @param media
   * @returns
   */
  protected createResultData(media: HTMLMediaElement) {
    this.updatePlayedSegments();
    const [startTime, endTime] = this.playedSegments[this.playedSegments.length - 1];
    return {
      duration: endTime - startTime,
      time: MediaUtils.utilFloorToDecimals(media.currentTime),
      progress:
        media.duration > 0 ? Math.floor((media.currentTime / media.duration) * 100) / 100 : 0,
      "played-segments": [MediaUtils.convertSegments(this.playedSegments)],
    };
  }

  /**
   * context 데이터 생성
   * @param media
   * @returns
   */
  protected createContextData(media: HTMLMediaElement) {
    const fileName = this.createObjectData(media).fileName;
    const length = MediaUtils.utilFloorToDecimals(media.duration);
    const speed = `${media.playbackRate.toFixed(1)}x`;
    const volume = MediaUtils.utilFloorToDecimals(media.volume);
    const isFullScreen = !!(
      document.fullscreenElement === media || (document as any).webkitFullscreenElement === media
    );
    return {
      length,
      format: MediaUtils.utilMediaFormat(fileName),
      speed,
      volume,
      fullScreen: isFullScreen,
    };
  }

  abstract createPlayEvent(media: HTMLMediaElement): any;
  abstract createPauseEvent(media: HTMLMediaElement): any;
  abstract createSeekedEvent(media: HTMLMediaElement): any;
  abstract initPageIn(media: HTMLMediaElement): any;
  abstract initPageOut(media: HTMLMediaElement): any;
  abstract createControlChangeEvent(media: HTMLMediaElement): any;
}
