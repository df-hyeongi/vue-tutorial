import { BaseMediaEventService } from "./base-media-event-service";
import { Debouncer } from "./debounce";
import { MediaUtils } from "./media-utils";

export class MediaEventService extends BaseMediaEventService {
  createPlayEvent(media: HTMLMediaElement) {
    console.log('this.seeking', this.seeking)
    // 탐색중에 play 이벤트 발생 제어 
    // pause와는 다르게 play에서는 media.seeking 상태가 변하지 않음. 조건에 this.seeking만 추가
    if (this.seeking) {
      this.updatePlayTime(media.currentTime)
      return
    }

    this.updatePlayTime(media.currentTime)

    const result = {
      ...this.createObjectData(media),
      ...this.createContextData(media),
      ...this.createTimeData(media),
    };
    console.log('play result', result)
    return result;
  }

  // pause에서는 media.seeking 상태가 변함
  createPauseEvent(media: HTMLMediaElement) {
    if (this.seeking || media.seeking) {
      this.updatePauseTime(media.currentTime)
      return
    }

    this.updatePauseTime(media.currentTime)
    this.playedSegments = this.addPlayedSegments(this.playedSegments, this.playTime, this.pausePlayTime)

    const result = {
      ...this.createObjectData(media),
      ...this.createResultData(media, this.playedSegments),
      ...this.createPlayedSegmentsData(this.playedSegments),
    };
    console.log("pause result", result);
  }

  createSeekedEvent(media: HTMLMediaElement) {
    // TODO: 드래그 이벤트를 막아야 한다면?
    Debouncer.debounce(() => {
      // seeked에서는 seeking 상태가 변하지 않음(false)
      this.seeking = media.seeking
      const result = {
        ...this.createObjectData(media),
        ...this.createSeekedData(media.currentTime)
      }
      this.prevPlayTime = media.currentTime
      // TODO: 추후 return으로 처리해야함
      console.log('seeking result', result)
    }, 300)
  }

  createSeekingEvent(media: HTMLMediaElement) {
    // seeking에서는 seeking 상태가 변하지 않음(true)
    this.seeking = media.seeking
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
    this.initCurrentMedia(media)
    const result = {
      ...this.createObjectData(media),
      ...this.createContextData(media),
    };
    // console.log("initPageIn", result);
  }

  initPageOut() {
    if (this.currentMedia) {
      const result = {
        ...this.createObjectData(this.currentMedia),
        ...this.createResultData(this.currentMedia, this.playedSegments),
        "played-segments": MediaUtils.convertSegments(this.playedSegments),
      };
      // console.log('initPageOut', result)
      return result
    }
    this.currentMedia = null;
  }

  watchCanPlayEvent(canPlay: boolean) {
    this.canPlay = canPlay
  }
}
