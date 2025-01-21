export class InteractionObserver {
  private lastEventTime: number = 0;
  private isDragging: boolean = false;
  private readonly DRAG_THRESHOLD: number = 600;

  observe(): boolean {
    const currentTime = Date.now();
    const timeSinceLastEvent = currentTime - this.lastEventTime;

    if (timeSinceLastEvent < this.DRAG_THRESHOLD) {
      this.isDragging = true;
      this.lastEventTime = currentTime;
      return false; // 드래그 중
    }

    if (this.isDragging) {
      this.isDragging = false;
    }
    this.lastEventTime = currentTime;
    return true; // 단일 이벤트
  }

  disconnect() {
    this.lastEventTime = 0;
    this.isDragging = false;
  }
}