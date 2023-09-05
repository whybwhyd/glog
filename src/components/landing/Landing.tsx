import React, { useEffect, useState } from 'react';

import * as Styled from './style';

const Landing = () => {
  const [percentage, setPercentage] = useState(0);
  const completeclass = percentage >= 100 ? 'true' : 'false';

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    const increasePercentage = () => {
      setPercentage((prevPercentage: number) => {
        const newPercentage = prevPercentage + 1;
        if (newPercentage >= 100) {
          clearInterval(timer as NodeJS.Timeout);
          return 100; // percentage가 100 이상으로 가지 않도록 보장
        }
        return newPercentage;
      });
    };

    timer = setInterval(increasePercentage, 30);

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);

  return (
    <Styled.PageLanding completeclass={completeclass}>
      {percentage <= 50 && (
        <>
          <Styled.MainText>지구를 여행했던 기록을 남겨보세요</Styled.MainText>
          <Styled.ServeText>멋진 여행의 순간을 많은 사람들과 공유하고 탐색해보세요</Styled.ServeText>
        </>
      )}
      {percentage > 50 && (
        <>
          <Styled.MainText>지구를 돌려서 가고싶은 여행장소를 살펴보세요</Styled.MainText>
          <Styled.ServeText>지구 위 불빛들을 클릭해보세요</Styled.ServeText>
        </>
      )}
      <Styled.Landing>
        <Styled.LandingBar percentage={percentage} />
      </Styled.Landing>
    </Styled.PageLanding>
  );
};

export default Landing;
