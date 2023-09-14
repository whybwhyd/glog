import React, { useEffect, useState } from 'react';

import { useInView } from 'react-intersection-observer';

import SessionDependentView from './SearchList.SessionDependentView';
import { getListPost, getMyListPost, getPosts } from '../../api/supabaseDatabase';
import { useMapLocationStore } from '../../zustand/useMapLocationStore';
import { useSearchStore } from '../../zustand/useSearchStore';
import { useSessionStore } from '../../zustand/useSessionStore';
import { useTabStore } from '../../zustand/useTabStore';
import { PAGE_COUNT } from '../likesList/LikesList';

import type { Tables } from '../../types/supabase';

interface SearchListProps {
  keyword: string;
  isSearchListOpened: boolean;
}

const SearchList = ({ keyword, isSearchListOpened }: SearchListProps) => {
  const { key, setKey } = useSearchStore();
  const [page, setPage] = useState<number>(0);
  const mapLocation = useMapLocationStore(state => state.mapLocation);

  const [searchResult, setSearchResult] = useState<Array<Tables<'posts'>>>([]);
  const session = useSessionStore(state => state.session);
  const tab = useTabStore(state => state.tab);

  const addPostData = async () => {
    setPage(prev => prev + PAGE_COUNT);

    if (key !== '') {
      console.log('hi');
      const SearchData = await getPosts();
      const searchData = SearchData?.filter(item => item.countryId?.includes(key) || item.regionId?.includes(key) || item.address?.includes(key));
      setSearchResult(searchData);
    } else if (tab === 'explore') {
      console.log('test');
      const postData = await getListPost(page);
      setSearchResult(prevPosts => [...prevPosts, ...postData]);
    } else {
      const postData = await getMyListPost({ userId: session?.user.id as string, page });
      setSearchResult(prevPosts => [...prevPosts, ...postData]);
    }
  };

  const { ref } = useInView({
    threshold: 1,
    triggerOnce: true,
    onChange: inView => {
      if (!inView) return;
      addPostData();
    },
  });

  useEffect(() => {
    if (isSearchListOpened) {
      setKey(keyword);
    } else setKey('');
  }, [keyword, isSearchListOpened]);

  useEffect(() => {
    setPage(0);
    addPostData();
  }, [tab, key]);

  useEffect(() => {
    if (searchResult && searchResult.length > 0 && key.length > 0) {
      const correctResult = searchResult[0]?.countryId?.includes(key) || searchResult[0]?.regionId?.includes(key) || searchResult[0].address?.includes(key);
      if (correctResult) {
        const coordinates: [number, number] = [searchResult[0].longitude, searchResult[0].latitude];
        mapLocation.flyTo({ center: coordinates, zoom: 4 });
      }
    }
  }, [key, searchResult, mapLocation]);

  return <SessionDependentView session={session} searchResult={searchResult} ref={ref} />;
};

export default SearchList;
