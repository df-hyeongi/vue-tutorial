import type { MediaEvent } from "./media-event-interface"
import { MediaUtils } from "./media-utils"

export abstract class BaseMediaEventService implements MediaEvent {
  private _currentMedia: HTMLMediaElement | null = null
  private _playedSegments: [number, number][] = []
  private _playTime = 0
  private _prevPlayTime = 0
  private _pausePlayTime = 0
  private _seeking = false
  private _canPlay = false
  private _isEnded = false

  constructor(private mediaUtils: typeof MediaUtils = MediaUtils) {}
  /**
   * init시에 담는 media 객체
   * @param media
   */
  protected initCurrentMedia(media: HTMLMediaElement) {
    this._currentMedia = media
  }

  /**
   * pageOut 시 사용되는 media 객체
   */
  protected get currentMedia(): HTMLMediaElement | null {
    return this._currentMedia
  }

  protected set currentMedia(media: HTMLMediaElement | null) {
    this._currentMedia = media
  }

  /**
   * 재생구간을 담는 배열
   */
  protected get playedSegments() {
    return this._playedSegments
  }

  protected set playedSegments(segments: [number, number][]) {
    this._playedSegments = segments
  }

  /**
   * play시에 기록되는 media.currentTime
   */
  protected get playTime() {
    return this._playTime
  }

  protected set playTime(time: number) {
    this._playTime = time
  }

  /**
   * seeked시에 기록되는 이전 media.currentTime
   */
  protected get prevPlayTime() {
    return this._prevPlayTime
  }

  protected set prevPlayTime(time: number) {
    this._prevPlayTime = time
  }

  /**
   * pause시에 기록되는 pausePlayTime
   */
  protected get pausePlayTime() {
    return this._pausePlayTime
  }

  protected set pausePlayTime(time: number) {
    this._pausePlayTime = time
  }

  /**
   * seeking 상태
   */
  protected get seeking() {
    return this._seeking
  }

  protected set seeking(seeking: boolean) {
    this._seeking = seeking
  }

  /**
   * 재생 가능한 상태
   */
  protected get canPlay() {
    return this._canPlay
  }

  protected set canPlay(canPlay: boolean) {
    this._canPlay = canPlay
  }

  /**
   * 동영상이 끝났음
   */
  protected get isEnded() {
    return this._isEnded
  }

  protected set isEnded(ended: boolean) {
    this._isEnded = ended
  }

  /**
   * 재생(play) 시간 업데이트
   * @param currentTime
   */
  protected updatePlayTime(currentTime: number) {
    this.prevPlayTime = this.playTime
    this.playTime = currentTime
  }

  /**
   * 정지(pause) 시간 업데이트
   * @param currentTime
   */
  protected updatePauseTime(currentTime: number) {
    this.prevPlayTime = currentTime
    this.pausePlayTime = currentTime
  }

  /**
   * 비디오 종료 시 정지(pause) 이벤트에서 발생하는 재생 구간 초기화
   */
  protected resetPlayedSegments() {
    this.playedSegments = []
    this.playTime = 0
  }

  /**
   * 정지(pause) 이벤트 결과 생지
   */
  protected pauseResult(media: HTMLMediaElement) {
    return {
      ...this.createObjectData(media),
      ...this.createResultData(media, this.playedSegments),
      ...this.createPlayedSegmentsData(this.playedSegments),
    }
  }

  /**
   * 재생 구간을 추적하고 새로운 세그먼트 배열을 반환
   * @param playedSegments 기존 재생 구간 배열
   * @param lastPlayTime 이전 재생 시간
   * @param currentTime 현재 재생 시간
   * @returns 업데이트된 세그먼트 배열
   */
  protected addPlayedSegments(
    playedSegments: [number, number][],
    lastPlayTime: number,
    currentTime: number
  ): [number, number][] {
    const newSegment: [number, number] = [
      this.mediaUtils.utilFloorToDecimals(lastPlayTime),
      this.mediaUtils.utilFloorToDecimals(currentTime),
    ]

    return [...playedSegments, newSegment]
  }

  /**
   * 미디어 준비 상태 확인
   * https://developer.mozilla.org/ko/docs/Web/API/HTMLMediaElement/readyState
   * @param media
   * @returns
   */
  protected isReadyMedia(media: HTMLMediaElement) {
    return media.readyState > 2
  }

  /**
   * object 데이터 생성
   * @param media
   * @returns
   */
  protected createObjectData(media: HTMLMediaElement) {
    const mediaUrl = media.currentSrc || media.src
    const fileName = this.mediaUtils.utilMediaFileName(mediaUrl)
    const mediaSessionId = "438109af-ea37-4dbb-8df0-d9d1bbd9d5c2"
    const type = media instanceof HTMLVideoElement ? "video" : "audio"

    return {
      fileName,
      mediaUrl,
      mediaSessionId,
      type,
    }
  }

  /**
   * time 데이터 생성
   * @param media
   * @returns
   */
  protected createTimeData(media: HTMLMediaElement) {
    return {
      time: this.mediaUtils.utilFloorToDecimals(media.currentTime),
    }
  }

  /**
   * result 데이터 생성
   * @param media
   * @returns
   */
  protected createResultData(
    media: HTMLMediaElement,
    playedSegments: [number, number][]
  ) {
    if (playedSegments.length === 0) return
    const [startTime, endTime] = playedSegments[playedSegments.length - 1]
    return {
      duration: this.mediaUtils.formatDurationToISO8601(endTime - startTime),
      progress:
        media.duration > 0
          ? Math.floor((media.currentTime / media.duration) * 100) / 100
          : 0,
      ...this.createTimeData(media),
    }
  }

  /**
   * playedSegements 데이터 생성
   */
  protected createPlayedSegmentsData(playedSegments: [number, number][]) {
    return {
      playedSegments: this.mediaUtils.convertSegments(playedSegments),
    }
  }

  /**
   * seeked 데이터 생성
   * @param currentTime
   * @returns
   */
  protected createSeekedData(currentTime: number) {
    return {
      "time-from": this.mediaUtils.utilFloorToDecimals(this.prevPlayTime),
      "time-to": this.mediaUtils.utilFloorToDecimals(
        this.mediaUtils.utilFloorToDecimals(currentTime)
      ),
    }
  }

  /**
   * context 데이터 생성
   * @param media
   * @returns
   */
  protected createContextData(media: HTMLMediaElement): {
    length: number
    format: string
    speed: string
    volume: number
    fullScreen?: boolean
  } {
    const fileName = this.createObjectData(media).fileName
    const length = this.mediaUtils.utilFloorToDecimals(media.duration)
    const speed = `${media.playbackRate}x`
    const volume = this.mediaUtils.utilFloorToDecimals(media.volume)
    const isFullScreen = !!(
      document.fullscreenElement === media ||
      (document as any).webkitFullscreenElement === media
    )

    const result = {
      length,
      format: this.mediaUtils.utilMediaFormat(fileName),
      speed,
      volume: media.muted ? 0 : volume,
    }

    if (media instanceof HTMLVideoElement)
      return {
        ...result,
        fullScreen: isFullScreen,
      }
    if (media instanceof HTMLAudioElement)
      return {
        ...result,
      }
    return result
  }

  abstract createPlayEvent(media: HTMLMediaElement): any
  abstract createPauseEvent(media: HTMLMediaElement): any
  abstract createSeekedEvent(media: HTMLMediaElement): any
  abstract createSeekingEvent(media: HTMLMediaElement): any
  abstract initPageIn(media: HTMLMediaElement): any
  abstract initPageOut(media: HTMLMediaElement): any
  abstract createControlChangeEvent(media: HTMLMediaElement): any
  abstract watchCanPlayEvent(canPlay: boolean): any
  abstract watchEnded(ended: boolean): any
}
