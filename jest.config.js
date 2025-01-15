export default {
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }], // ts-jest 설정을 transform에 정의
  },
};
