import toast from 'react-simple-toasts';

import { supabase } from './supabaseClient';

export const LAST_INDEX = 4;

export const getUser = async (email?: string) => {
  const { data, error } = await supabase.from('users').select('*').eq('email', email);
  if (error) throw new Error(`error: ${error.message}`);
  return data[0];
};

export const addNewUser = async (id: string, email: string, name: string, profileImg: string) => {
  const data = await getUser(email);
  if (!data) {
    await supabase.from('users').insert({ id, email, name, profileImg });
  } else {
    await supabase.from('users').update({ name, profileImg }).eq('id', id);
  }
};

export const getPosts = async () => {
  const { data, error } = await supabase.from('posts').select('*, user:userId(*)').eq('private', false).order('createdAt', { ascending: false });
  if (error) throw new Error(`에러!! ${error.message}`);
  return data;
};

export const getListPost = async (page: number) => {
  const from = page;
  const to = from + LAST_INDEX;
  const { data, error } = await supabase.from('posts').select('*, user:userId(*)').eq('private', false).order('createdAt', { ascending: false }).range(from, to);
  if (error) throw new Error(`에러!! ${error.message}`);
  return data;
};

export const getMyPosts = async (userId: string) => {
  const { data, error } = await supabase.from('posts').select('*, user:userId(*)').eq('userId', userId).order('createdAt', { ascending: false });
  if (error) throw new Error(`에러!! ${error.message}`);
  return data;
};

export const getMyListPost = async ({ userId, page }: { userId: string; page: number }) => {
  const from = page;
  const to = from + LAST_INDEX;
  const { data, error } = await supabase.from('posts').select('*, user:userId(*)').eq('userId', userId).order('createdAt', { ascending: false }).range(from, to);
  if (error) throw new Error(`에러!! ${error.message}`);
  return data;
};

export const getPostByPostId = async (postId: string) => {
  const { data, error } = await supabase.from('posts').select('*, user:userId(*)').eq('id', postId);
  if (error) throw new Error(`에러!! ${error.message}`);
  return data[0];
};

export const getPostByUserId = async (userId: string) => {
  const { data, error } = await supabase.from('posts').select(`*, user:userId(*)`).eq('userId', userId).order('createdAt', { ascending: false }).limit(1);
  if (error) throw new Error(`에러!! ${error.message}`);
  return data[0];
};

export const getLikes = async (userId: string) => {
  const { data, error } = await supabase.from('likes').select('*').eq('userId', userId);
  if (error) throw new Error(`에러!! ${error.message}`);
  return data;
};

export const getIsLike = async (postId: string) => {
  const { data, error } = await supabase.from('likes').select('*').eq('postId', postId);
  if (error) throw new Error(`에러!! ${error.message}`);
  return data;
};

export const getPostLikes = async (postId: string[], page: number) => {
  const from = page;
  const to = from + LAST_INDEX;
  const { data, error } = await supabase.from('posts').select('*, user:userId(*)').in('id', postId).eq('private', false).order('createdAt', { ascending: false }).range(from, to);
  if (error) throw new Error(`에러!! ${error.message}`);
  return data;
};

export const addLike = async ({ postId, userId }: { postId: string; userId: string }) => {
  await supabase.from('likes').insert({ postId, userId });
};

export const deleteLike = async (id: string) => {
  await supabase.from('likes').delete().eq('id', id);
};

export const deletePost = async (postId: string) => {
  try {
    await supabase.from('likes').delete().eq('postId', postId);
    await supabase.from('posts').delete().eq('id', postId);
    toast('삭제 완료!', { className: 'post-alert', position: 'top-center' });
  } catch (error) {
    console.error('Error deleting post and likes:', error);
  }
};
