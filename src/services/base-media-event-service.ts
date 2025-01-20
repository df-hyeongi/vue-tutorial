import type { MediaEvent } from "./media-event-interface";
import { MediaUtils } from "./media-utils";

export abstract class BaseMediaEventService implements MediaEvent {
  // TODO: 전역으로 사용되는 변수들 최대한 제거해서 구현
  protected currentMedia: HTMLMediaElement | null = null;
  protected sessionStartTime = 0;
  protected currentPlayTime = 0;
  protected timeFrom = 0;
  protected playedSegments: [number, number][] = [];

  /**
   * 현재 재생 시간 업데이트
   * @param media
   * @returns
   */
  protected updateLastPlayedTime(time: number) {
    this.currentPlayTime = time;
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
    return {
      duration: MediaUtils.calculateSessionDuration(this.sessionStartTime, Date.now()),
      time: MediaUtils.utilFloorToDecimals(media.currentTime),
      progress:
        media.duration > 0 ? Math.floor((media.currentTime / media.duration) * 100) / 100 : 0,
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
      format: MediaUtils.utilVideoFormat(fileName),
      speed,
      volume,
      fullScreen: isFullScreen,
    };
  }

  /**
   * 재생 구간을 추적하고 새로운 세그먼트 배열을 반환
   * @param currentTime 현재 재생 시간
   * @returns 업데이트된 세그먼트 배열
   */
  protected addPlayedSegment(currentTime: number): [number, number][] {
    const newSegment: [number, number] = [
      this.currentPlayTime,
      MediaUtils.utilFloorToDecimals(currentTime),
    ];

    return [...this.playedSegments, newSegment];
  }

  protected createPlayedSegments(media: HTMLMediaElement) {
    const currentTime = MediaUtils.utilFloorToDecimals(media.currentTime);
    const updatedSegments = this.addPlayedSegment(currentTime);

    // 상태 업데이트
    this.currentPlayTime = currentTime;
    this.playedSegments = updatedSegments;

    return {
      "played-segments": [MediaUtils.convertSegments(this.playedSegments)],
    };
  }

  abstract createPlayEvent(media: HTMLMediaElement): any;
  abstract createPauseEvent(media: HTMLMediaElement): any;
  abstract createSeekedEvent(media: HTMLMediaElement): any;
  abstract initPageIn(media: HTMLMediaElement): any;
  abstract initPageOut(media: HTMLMediaElement): any;
  abstract createControlChangeEvent(media: HTMLMediaElement): any;
}
