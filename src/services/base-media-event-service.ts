import type { MediaEvent } from "./media-event-interface";

export abstract class BaseMediaEventService implements MediaEvent {
  protected sessionStartTime = 0;
  protected currentPlayTime = 0;
  protected timeFrom = 0;
  protected playedSegments: [number, number][] = [];

  constructor() {}

  /**
   *
   * @param segments video, audio class에서 관리하고 있는 playedSegments 배열(played-segments 값으로 사용됨)
   * @param value 추가하려는 [number, number] 형태의 배열
   * @returns
   */
  protected appendPlayedSegments(segments: [number, number][], value: [number, number]) {
    segments.push(value);
    return segments;
  }
  /**
   *
   * @param media
   * @returns
   */
  protected updateLastPlayedTime(time: number) {
    this.currentPlayTime = time;
  }

  abstract createPlayEvent(media: HTMLMediaElement): any;
  abstract createPauseEvent(media: HTMLMediaElement): any;
  abstract createSeekedEvent(media: HTMLMediaElement): any;
  abstract initPageIn(media: HTMLMediaElement): any;
  abstract initPageOut(media: HTMLMediaElement): any;
}
