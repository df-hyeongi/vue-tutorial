export class MediaUtils {
  /**
   * @param mediaUrl video, audio의 url 주소
   * @returns 파일명 or unknown을 반환
   */
  static utilMediaFileName(mediaUrl: string): string {
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

  /**
   *  파일 이름의 확장자를 확인하여 동영상 형식인지 확인
   * @param fileName 파일명
   * @returns
   */
  static utilVideoFormat(fileName: string) {
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
  static utilFloorToDecimals(value: number, decimals = 2) {
    const factor = Math.pow(10, decimals); // 10^decimals
    return Math.floor(value * factor) / factor;
  }

  /**
   * ISO 8601 형식 변환 함수
   * @param duration
   * @returns
   */
  static formatDurationToISO8601(duration: number): string {
    return `PT${Math.floor(duration)}S`; // ISO 8601 형식 예: PT218S
  }

  // TODO: 함수 이름 바꿔야함
  /**
   * 페이지에 머문 시간 계산
   */
  static calculateSessionDuration(sessionStartTime: number, sessionEndTime: number): string {
    const MILLISECONDS_IN_SECOND = 1000;
    if (!sessionStartTime) {
      throw new Error("playedTime이 기록되지 않았습니다.");
    }
    const sessionDuration = (sessionEndTime - sessionStartTime) / MILLISECONDS_IN_SECOND;
    return `PT${sessionDuration}S`;
  }

  /**
   * played-segments을 명세서 문자열로 변환
   * @param segments playedSegments
   * @returns
   */
  static convertSegments(segments: [number, number][]): string {
    return segments
      .map(([start, end]) => `${start}[.]${end}`) // 각 [start, end]를 'start[.]end'로 변환
      .join("[,]"); // 배열 요소를 [,]로 연결
  }

  static createCommonInfo(media: HTMLMediaElement) {
    const mediaUrl = media.currentSrc || media.src;
    const fileName = this.utilMediaFileName(mediaUrl);
    const length = this.utilFloorToDecimals(media.duration);
    const speed = `${media.playbackRate.toFixed(1)}x`;
    const volume = this.utilFloorToDecimals(media.volume);
    return {
      fileName,
      mediaUrl,
      format: this.utilVideoFormat(fileName),
      length,
      speed,
      volume,
    };
  }
}
