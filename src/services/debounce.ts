export class Debouncer {
  private static timeoutId: number | null = null;
  /**
   * 디바운스 함수: 연속된 호출에서 마지막 호출만 실행되도록 제어
   * @param callback 실행할 함수
   * @param wait 대기 시간 (밀리초)
   */
  static debounce(callback: () => void, wait: number = 300) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      callback();
      this.timeoutId = null;
    }, wait);
  }
}
