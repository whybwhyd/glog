import React, { useRef, useState } from 'react';
import * as Styled from './style';
import Like from '../../like/Like';
import { Tables } from '../../../types/supabase';
import useOnClickOutside from '../../../hooks/useOnClickOutSide';
import Detail from '../../detail/Detail';

type PostItemProps = { data: Tables<'posts'> };

const PostItem: React.FC<PostItemProps> = ({ data }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isClicked, setIsClicked] = useState(false);

  const showDetail = () => setIsClicked(!isClicked);

  useOnClickOutside(ref, showDetail);

  return (
    <div>
      {isClicked ? (
        <Styled.DetailLayout ref={ref}>
          <Detail data={data} />
        </Styled.DetailLayout>
      ) : (
        <Styled.PostItemLayout onClick={showDetail}>
          {data.images !== null ? <Styled.PostItemImg src={data.images} alt="" /> : null}
          <Styled.LocationParagraph>
            {data.countryId}, {data.regionId}
          </Styled.LocationParagraph>
          <Styled.LikeBox>
            <Like data={data} />
          </Styled.LikeBox>
        </Styled.PostItemLayout>
      )}
    </div>
  );
};

export default PostItem;
