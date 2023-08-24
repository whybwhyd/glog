import React, { useEffect, useState } from 'react';
import PostItem from '../common/postItem/PostItem';
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../../api/supabaseDatabase';
import { Tables } from '../../types/supabase';
import { useSessionStore } from '../../zustand/store';
import { signin } from '../../api/supabaseAuth';

type SearchListProps = {
  keyword: string;
  isSearchListOpened: boolean;
};

const SearchList: React.FC<SearchListProps> = ({ keyword, isSearchListOpened }) => {
  const [key, setKey] = useState('');
  const [searchResult, setSearchResult] = useState<Tables<'posts'>[]>();
  const session = useSessionStore(state => state.session);
  const { data } = useQuery(['getPosts'], getPosts);

  useEffect(() => {
    if (isSearchListOpened) {
      setKey(keyword);
    } else setKey('');
  }, [keyword, isSearchListOpened]);

  useEffect(() => {
    if (data) {
      const filteredData = data?.filter(item => item.countryId?.includes(key) || item.regionId?.includes(key) || item.address?.includes(key));
      setSearchResult(filteredData);
    }
  }, [data, key]);

  console.log(searchResult);
  console.log(session);
  return (
    <>
      {session ? (
        <>
          {searchResult?.map(item => (
            <PostItem images={item.images} countryId={item.countryId} regionId={item.regionId} />
          ))}
        </>
      ) : (
        <>
          {searchResult?.slice(0, 5).map(item => (
            <PostItem images={item.images} countryId={item.countryId} regionId={item.regionId} />
          ))}
          <button onClick={signin}>로그인하세요</button>
        </>
      )}
    </>
  );
};

export default SearchList;
