import type { MediaEvent } from "./media-event-interface";
import { MediaUtils } from "./media-utils";

export abstract class BaseMediaEventService implements MediaEvent {
  // TODO: 전역으로 사용되는 변수들 최대한 제거해서 구현
  private _currentMedia: HTMLMediaElement | null = null;
  private _playedSegments: [number, number][] = [];
  private _playTime = 0;
  private _timeFrom = 0;
  private _pausePlayTime = 0;
  private _seeking = false
  protected sessionStartTime = 0;

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
    this._currentMedia = media
  }

  /**
   * getter media
   * @returns
   */
  protected get currentMedia(): HTMLMediaElement | null {
    return this._currentMedia
  }

  /**
   * setter media 
   * @returns
   */
  protected set currentMedia(media: HTMLMediaElement | null) {
    this._currentMedia = media
  }

  /**
   * getter playedSegments
   * @returns
   */
  protected get playedSegments() {
    return this._playedSegments
  }

  /**
   * getter playedSegments
   * @returns
   */
  protected set playedSegments(segments: [number, number][]) {
    this._playedSegments = segments
  }

  /**
   * getter playTime
   * @returns
   */
  protected get playTime() {
    return this._playTime
  }

  /**
   * setter playTime
   * @param media
   * @returns
   */
  protected set playTime(time: number) {
    this._playTime = time;
  }

  /**
   * getter timeFrom
   * @returns
   */
  protected get timeFrom() {
    return this._timeFrom
  }

  /**
   * setter timeFrom
   * @param media
   * @returns
   */
  protected set timeFrom(time: number) {
    this._timeFrom = time
  }

  /**
   * getter pausePlayTime
   * @returns
   */
  protected get pausePlayTime() {
    return this._pausePlayTime
  }

  /**
   * setter pausePlayTime
   * @param media
   * @returns
   */
  protected set pausePlayTime(time: number) {
    this._pausePlayTime = time;
  }

  /**
     * seeking 상태 감지
     * @param media
     */
  protected get seeking() {
    return this._seeking
  }

  protected set seeking(seeking: boolean) {
    this._seeking = seeking
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
      MediaUtils.utilFloorToDecimals(lastPlayTime),
      MediaUtils.utilFloorToDecimals(currentTime),
    ];

    return [...playedSegments, newSegment];
  }

  // TODO: createSeekedEvent에 맞는 결과값에 상응하는 함수명으로 수정하기
  protected createTimeFromTimeTo(currentTime: number) {
    return {
      "time-from": MediaUtils.utilFloorToDecimals(this.timeFrom),
      "time-to": MediaUtils.utilFloorToDecimals(MediaUtils.utilFloorToDecimals(currentTime)),
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
   * time 데이터 생성
   * @param media
   * @returns
   */
  protected createTimeData(media: HTMLMediaElement) {
    return {
      time: MediaUtils.utilFloorToDecimals(media.currentTime),
    };
  }

  /**
   * result 데이터 생성
   * @param media
   * @returns
   */
  protected createResultData(media: HTMLMediaElement) {
    if (this.playedSegments.length === 0) return
    const [startTime, endTime] = this.playedSegments[this.playedSegments.length - 1];
    return {
      duration: endTime - startTime,
      progress:
        media.duration > 0 ? Math.floor((media.currentTime / media.duration) * 100) / 100 : 0,
      ...this.createTimeData(media),
    };
  }

  /**
   * playedSegements 데이터 생성
   */
  protected createPlayedSegmentsData() {
    const playedSegments = this.addPlayedSegment(this.playedSegments, this.playTime, this.pausePlayTime)
    this.playedSegments = playedSegments
    return {
      "played-segments": [MediaUtils.convertSegments(playedSegments)],
    }
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
  abstract createSeekingEvent(media: HTMLMediaElement): any;
  abstract initPageIn(media: HTMLMediaElement): any;
  abstract initPageOut(media: HTMLMediaElement): any;
  abstract createControlChangeEvent(media: HTMLMediaElement): any;
}
