import { utilMediaFileName, utilVideoFormat, utilFloorToDecimals } from "../src/utils/index";
describe("utilMediaFileName 테스트", () => {
  it("유효한 url", () => {
    expect(utilMediaFileName("https://example.com/video.mp4")).toBe("video.mp4");
    expect(utilMediaFileName("https://example.com/files/video%20file.mp4")).toBe("video file.mp4");
    expect(utilMediaFileName("https://example.com/videos/video.mp4?version=1")).toBe("video.mp4");
    expect(utilMediaFileName("http://localhost:8080/mydir/myfile.mp4")).toBe("myfile.mp4");
    expect(utilMediaFileName("file:///C:/path/to/file.mp4")).toBe("file.mp4");
  });

  it("유효하지 않은 url or 빈 url", () => {
    expect(utilMediaFileName("")).toBe("unknown");
    expect(utilMediaFileName(" ")).toBe("unknown");
    expect(utilMediaFileName("https://example.com/")).toBe("unknown");
    expect(utilMediaFileName("https://example.com")).toBe("unknown");
    expect(utilMediaFileName(null as unknown as string)).toBe("unknown");
    expect(utilMediaFileName(undefined as unknown as string)).toBe("unknown");
  });

  it("경계값 테스트", () => {
    expect(utilMediaFileName("https://example.com/video%20file")).toBe("video file"); // %20 공백
    expect(utilMediaFileName("https://example.com/file%23name%24.mp4")).toBe("file#name$.mp4"); // %23 #, %24 $ 테스트
    expect(utilMediaFileName("https://example.com/video.mp4?")).toBe("video.mp4"); // 쿼리 경계값
    expect(utilMediaFileName("https://example.com/dir/subdir/")).toBe("unknown"); // 폴더만 포함
  });

  it("디코딩 에러", () => {
    expect(utilMediaFileName("https://example.com/file%ZZ.mp4")).toBe("unknown"); // %ZZ 유효하지 않음
    expect(utilMediaFileName("https://example.com/file%")).toBe("unknown"); // % 뒤에 문자가 없음
    expect(utilMediaFileName("https://example.com/%E0%A4%A.mp4")).toBe("unknown"); // 유효하지 않은 UTF-8
  });
});

describe("유효한 비디오 확장자", () => {
  it("유효한 확장자", () => {
    const fileName = utilMediaFileName("https://example.com/file%23name%24.mp4");
    const fileName2 = utilMediaFileName("https://example.com/file%23name%24.mov");
    expect(utilVideoFormat(fileName)).toBe("mp4");
    expect(utilVideoFormat(fileName2)).toBe("mov");
  });

  it("유효하지 않은 확장자", () => {
    const fileName = utilMediaFileName("https://example.com/file%23name%24.mp3");
    const fileName2 = utilMediaFileName("https://example.com/file%23name%24.jpg");
    expect(() => utilVideoFormat(fileName)).toThrow(".mp3는 지원하지 않는 동영상 형식입니다.");
    expect(() => utilVideoFormat(fileName2)).toThrow(".jpg는 지원하지 않는 동영상 형식입니다.");
  });
});

describe("소수점 둘째 자리까지 나타낸다(아래 소수점 버림)", () => {
  expect(utilFloorToDecimals(1.2345)).toBe(1.23);
  expect(utilFloorToDecimals(1.236)).toBe(1.23);
});
