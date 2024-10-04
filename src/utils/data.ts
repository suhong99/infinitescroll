import { MOCK_DATA, MockData } from '../const/mock';

const PER_PAGE = 10;

// page는 uncontrolled 요소
let page = 0;

interface resultType {
  datas: MockData[];
  isEnd: boolean;
}

export const getPage = () => page;
export const setNextPage = () => page++;

// 페이지는 1부터 시작함
export const getMockData = (pageNum: number): Promise<resultType> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const datas: MockData[] = MOCK_DATA.slice(
        PER_PAGE * pageNum,
        PER_PAGE * (pageNum + 1)
      );
      const isEnd = PER_PAGE * (pageNum + 1) >= MOCK_DATA.length;

      resolve({ datas, isEnd });
    }, 1500);
  });
};
