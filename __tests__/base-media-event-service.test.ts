import { BaseMediaEventService } from '../src/services/base-media-event-service';
import { MediaUtils } from '../src/services/media-utils';

// MediaUtils의 모의 구현
const createMockMediaUtils = (): jest.Mocked<typeof MediaUtils> => ({
  utilFloorToDecimals: jest.fn((x: number) => Math.floor(x)),
  utilMediaFileName: jest.fn((url: string) => url.split('/').pop()?.split('.')[0] || ''),
  formatDurationToISO8601: jest.fn((duration: number) => `PT${duration}S`),
  convertSegments: jest.fn((segments: [number, number][]) =>
    segments.map(([start, end]) => `${start}-${end}`).join(',')),
  utilMediaFormat: jest.fn((fileName: string) => fileName.split('.').pop() || ''),
} as any);

// BaseMediaEventService의 구체 클래스 구현 (테스트용)
class TestMediaEventService extends BaseMediaEventService {
  constructor(mediaUtils = createMockMediaUtils()) {
    super(mediaUtils);
  }

  createPlayEvent = jest.fn();
  createPauseEvent = jest.fn();
  createSeekedEvent = jest.fn();
  createSeekingEvent = jest.fn();
  initPageIn = jest.fn();
  initPageOut = jest.fn();
  createControlChangeEvent = jest.fn();
  watchCanPlayEvent = jest.fn();
}

describe('BaseMediaEventService', () => {
  let service: TestMediaEventService;
  let mockMedia: HTMLMediaElement;
  let mockMediaUtils: jest.Mocked<typeof MediaUtils>;

  beforeEach(() => {
    // 모의 미디어 유틸리티 생성
    mockMediaUtils = createMockMediaUtils();

    // 모의 미디어 요소 생성
    mockMedia = document.createElement('video') as HTMLMediaElement;
    Object.assign(mockMedia, {
      currentTime: 10,
      duration: 100,
      src: 'http://example.com/test-media.mp4',
      playbackRate: 1,
      volume: 0.5,
      readyState: 4, // HAVE_ENOUGH_DATA
    });

    // 서비스 인스턴스 생성
    service = new TestMediaEventService(mockMediaUtils);
  });

  describe('Protected Methods', () => {
    test('initCurrentMedia should set current media', () => {
      (service as any).initCurrentMedia(mockMedia);
      expect((service as any).currentMedia).toBe(mockMedia);
    });

    test('updatePlayTime should update play time correctly', () => {
      (service as any).updatePlayTime(15);
      expect((service as any).prevPlayTime).toBe(0);
      expect((service as any).playTime).toBe(15);
    });

    test('addPlayedSegments should add new segment', () => {
      const initialSegments: [number, number][] = [];
      const result = (service as any).addPlayedSegments(initialSegments, 5, 10);

      expect(result).toEqual([[5, 10]]);
      expect(mockMediaUtils.utilFloorToDecimals).toHaveBeenCalledTimes(2);
    });

    test('createObjectData should return correct object data', () => {
      const result = (service as any).createObjectData(mockMedia);

      expect(result).toEqual({
        fileName: 'test-media',
        mediaUrl: 'http://example.com/test-media.mp4',
        mediaSessionId: expect.any(String),
      });
    });

    test('createContextData for video should include fullScreen', () => {
      const result = (service as any).createContextData(mockMedia);

      expect(result).toEqual({
        length: 100,
        format: 'mp4',
        speed: '1x',
        volume: 0.5,
        fullScreen: false,
      });
    });

    test('isReadyMedia should check media readiness', () => {
      expect((service as any).isReadyMedia(mockMedia)).toBe(true);
    });
  });

  describe('Getters and Setters', () => {
    test('should correctly set and get private properties', () => {
      (service as any).playTime = 20;
      (service as any).prevPlayTime = 10;

    });
  });
});