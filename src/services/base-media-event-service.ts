import type { MediaEvent } from "./media-event-interface";

export abstract class BaseMediaEventService implements MediaEvent {
  abstract createPlayEvent(media: HTMLMediaElement): any;
  abstract createPauseEvent(media: HTMLMediaElement): any;
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
}
