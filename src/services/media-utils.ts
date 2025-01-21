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
  static utilMediaFormat(fileName: string) {
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

    const audioExtensions = [
      "mp3",
      "wav",
      "ogg",
      "m4a",
      "aac",
      "wma",
      "flac",
      "alac",
      "aiff",
      "opus",
      "mid",
      "midi",
      "amr",
      "ac3",
      "pcm",
    ];

    const format = fileName.split(".").pop()?.toLocaleLowerCase();
    const isVideoFormat = videoExtensions.includes(format as string);
    const isAudioFormat = audioExtensions.includes(format as string);

    if (!isVideoFormat && !isAudioFormat) {
      throw new Error(`.${format}는 지원하지 않는 미디어 형식입니다.`);
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


  static convertSegments(segments: [number, number][]): string {
    return segments
      .map(([start, end]) => `${start}[.]${end}`) // 각 [start, end]를 'start[.]end'로 변환
      .join("[,]"); // 배열 요소를 [,]로 연결
  }
}
