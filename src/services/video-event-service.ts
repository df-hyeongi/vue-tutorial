import { BaseMediaEventService } from "./base-media-event-service";

export class VideoEventService {
  private static videoCurrentTime = 0;
  private static durationPlayed = 0;
  private static playedSegments: [number, number][] = [];
  /**
   *
   * @param mediaUrl video, audio의 url 주소
   * @returns 파일명 or unknown을 반환
   */
  protected static utilMediaFileName(mediaUrl: string): string {
    if (!mediaUrl || typeof mediaUrl !== "string" || mediaUrl.trim() === "") {
      return "unknown";
    }

    try {
      // URL 파싱
      const parsedUrl = new URL(mediaUrl);

      // 파일 이름 추출
      const pathname = parsedUrl.pathname;
      const fileName = pathname.split("/").pop();

      // 파일 이름이 유효한지 확인
      if (!fileName || fileName === "") {
        return "unknown";
      }

      return decodeURIComponent(fileName);
    } catch (e) {
      // URL 파싱 실패 시 "unknown" 반환
      return "unknown";
    }
  }

  protected static utilVideoFormat(fileName: string) {
    const videoExtensions = [
      "mp4",
      "mkv",
      "avi",
      "mov",
      "flv",
      "wmv",
      "webm",
      "mpeg",
      "mpg",
      "m4v",
      "3gp",
      "ogv",
      "vob",
      "ts",
      "f4v",
      "f4p",
      "rm",
      "rmvb",
      "asf",
      "divx",
      "dv",
      "mxf",
      "ogm",
      "yuv",
      "bik",
      "h264",
      "hevc",
      "r3d",
      "vr",
      "dash",
      "ismv",
      "m3u8",
    ];
    const format = fileName.split(".").pop()?.toLocaleLowerCase();
    const isVideoFormat = videoExtensions.includes(format as string);
    if (!isVideoFormat) {
      throw new Error(`.${format}는 지원하지 않는 동영상 형식입니다.`);
    }
    return format as string;
  }

  /**
   * 소수점 이하를 버림 처리
   * @param value 숫자 값
   * @param decimals 소수점 자릿수 (기본값: 2)
   * @returns 소수점 이하가 버림된 숫자
   */
  protected static utilFloorToDecimals(value: number, decimals = 2) {
    const factor = Math.pow(10, decimals); // 10^decimals
    return Math.floor(value * factor) / factor;
  }

  /**
   * ISO 8601 형식 변환 함수
   * @param duration
   * @returns
   */

  protected static formatDurationToISO8601(duration: number): string {
    return `PT${Math.floor(duration)}S`; // ISO 8601 형식 예: PT218S
  }

  // static createPlayEvent(video: HTMLVideoElement): {
  //   "file-name": string; // 파일 이름
  //   mediaUrl: string; // 미디어 URL
  //   time: number; // media의 현재 시간 위치. 소수점 둘째 자리까지 나타낸다(아래 소수점 버림).
  //   "media-session-id": string;
  //   length: number; // media의 실제 길이(초 단위). 소수점 둘째 자리까지 나타낸다(아래 소수점 버림).
  //   format: string; // media의 파일 형식 (ex. mp4 등)
  //   speed: string; // media의 재생 속도. 정상 속도에 대한 배율을 의미하는 'x'와 함께 10진수 또는 정수값으로 표시한다. 음수 값은 되감기(rewind)를 의미하며, 양수 값은 빨리감기(fast forward)를 의미한다. 값이 1x 미만인 양수 값은 슬로우 모션 재생을 의미한다.
  //   volume: number; // media 개체에 지정된 소리의 크기. 0~1 사이 값을 사용하며 소수점 둘째 자리까지 나타낸다(아래 소수점 버림).
  //   "full-screen": boolean; // video가 전체 화면 모드로 재생되는 것을 식별하는 데에 사용한다.
  // } {
  //   this.videoCurrentTime = video.currentTime;

  //   const mediaUrl = video.currentSrc || video.src;
  //   const fileName = VideoEventService.utilMediaFileName(mediaUrl);

  //   const time = VideoEventService.utilFloorToDecimals(video.currentTime);
  //   const length = VideoEventService.utilFloorToDecimals(video.duration);

  //   const isFullScreen = !!(
  //     document.fullscreenElement === video || (document as any).webkitFullscreenElement === video
  //   );

  //   const mediaSessionId = "438109af-ea37-4dbb-8df0-d9d1bbd9d5c2";

  //   const speed = `${video.playbackRate.toFixed(1)}x`;
  //   const volume = VideoEventService.utilFloorToDecimals(video.volume);

  //   const result = {
  //     "file-name": fileName,
  //     mediaUrl,
  //     time,
  //     "media-session-id": mediaSessionId,
  //     length,
  //     format: VideoEventService.utilVideoFormat(fileName),
  //     speed,
  //     volume,
  //     "full-screen": isFullScreen,
  //   };
  //   console.log("result", result);
  //   return result;
  // }

  static createPauseEvent(video: HTMLVideoElement) {
    // 현재 재생 구간 시간 계산
    if (this.videoCurrentTime !== null) {
      const currentTime = Date.now() / 1000; // 일시 정지 시점(초 단위)
      const sessionDuration = currentTime - this.videoCurrentTime; // 재생한 시간(초 단위)
      this.durationPlayed += sessionDuration; // 총 재생 시간 업데이트

      console.log("this.playStartTime", this.videoCurrentTime);
      // 현재 구간을 played-segments에 추가
      const currentSegment: [number, number] = [
        VideoEventService.utilFloorToDecimals(this.videoCurrentTime),
        VideoEventService.utilFloorToDecimals(video.currentTime),
      ];

      this.playedSegments.push(currentSegment);
      console.log("playedSegments", this.playedSegments);
    }

    const isEnded = video.ended;
    if (isEnded) {
      console.log("비디오가 끝까지 재생되었습니다.");
      const result = {
        duration: VideoEventService.formatDurationToISO8601(this.durationPlayed),
        time: VideoEventService.utilFloorToDecimals(video.currentTime),
        progress:
          video.duration > 0 ? Math.floor((video.currentTime / video.duration) * 100) / 100 : 0,
        "played-segments": "played-segments",
      };
      console.log(result);
    } else {
      console.log("비디오가 일시정지 되었습니다.");
      const result = {
        duration: VideoEventService.formatDurationToISO8601(this.durationPlayed),
        time: VideoEventService.utilFloorToDecimals(video.currentTime),
        progress:
          video.duration > 0 ? Math.floor((video.currentTime / video.duration) * 100) / 100 : 0,
        "played-segments": "played-segments",
      };

      console.log(result);
    }
  }
}
