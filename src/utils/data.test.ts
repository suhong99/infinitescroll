import { MOCK_DATA } from '../const/mock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getMockData, getPage, setNextPage } from './data';

const PER_PAGE = 10;

describe('getMockData 함수', () => {
  beforeEach(() => {
    // Fake timers을 사용하여 setTimeout을 제어
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks(); // 모든 mock을 복구
  });

  it('페이지 넘버에 맞는 데이터를 주어야 함', async () => {
    const pageNum = 1; // 테스트할 페이지 번호
    const expectedResult = {
      datas: MOCK_DATA.slice(10, 20), // 1페이지에 해당하는 mock 데이터
      isEnd: false, // 마지막 페이지가 아닌 경우
    };

    const dataPromise = getMockData(pageNum);

    // Fake timers로 setTimeout을 진행시키고
    vi.runAllTimers();

    // 데이터가 반환되었는지 확인
    await expect(dataPromise).resolves.toEqual(expectedResult);
  });

  it('마지막 페이지에서 올바르게 데이터 주어야 함', async () => {
    const pageNum = Math.floor(MOCK_DATA.length / PER_PAGE); // 마지막 페이지 번호
    const expectedResult = {
      datas: MOCK_DATA.slice(pageNum * PER_PAGE), // 마지막 페이지의 mock 데이터
      isEnd: true, // 마지막 페이지
    };

    const dataPromise = getMockData(pageNum);

    vi.runAllTimers();

    await expect(dataPromise).resolves.toEqual(expectedResult);
  });

  it('초기 페이지가 0이어야 함', () => {
    expect(getPage()).toBe(0);
  });

  it('페이지 증가 되어야 함', () => {
    setNextPage();
    expect(getPage()).toBe(1);
  });
});
