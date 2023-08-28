import { Tables } from '../types/supabase';
import { supabase } from './supabaseClient';
import toast from 'react-simple-toasts';

export const getUser = async (email?: string) => {
  const { data, error } = await supabase.from('users').select('*').eq('email', email);
  if (error) throw new Error(`error: ${error.message}`);
  return data[0];
};

export const addNewUser = async (id: string, email: string, name: string, profileImg: string) => {
  const data = await getUser(email);
  if (!data) {
    await supabase.from('users').insert({ id: id, email: email, name: name, profileImg: profileImg });
  } else {
    await supabase.from('users').update({ name: name, profileImg: profileImg }).eq('id', id);
  }
};

export const addPost = async (newPost: Tables<'posts'>) => {
  await supabase.from('posts').insert(newPost);
};

export const getMyPosts = async (userId: string) => {
  const { data, error } = await supabase.from('posts').select('*, user:userId(*)').eq('userId', userId);
  if (error) throw new Error(`에러!! ${error.message}`);
  return data;
};

export const getPosts = async () => {
  const { data, error } = await supabase.from('posts').select('*, user:userId(*)').eq('private', false);
  if (error) throw new Error(`에러!! ${error.message}`);
  return data;
};

export const getPost = async (userId: string) => {
  const { data, error } = await supabase.from('posts').select('*, user:userId(*)').eq('userId', userId).order('createdAt', { ascending: false }).limit(1);
  if (error) throw new Error(`에러!! ${error.message}`);
  return data[0];
};

export const getIsLike = async (postId: string) => {
  const { data, error } = await supabase.from('likes').select('*').eq('postId', postId);
  if (error) throw new Error(`에러!! ${error.message}`);
  return data;
};

export const getLikes = async (userId: string) => {
  const { data, error } = await supabase.from('likes').select('*').eq('userId', userId);
  if (error) throw new Error(`에러!! ${error.message}`);
  return data;
};

export const deleteButton = async (postId: string) => {
  try {
    await supabase.from('likes').delete().eq('postId', postId);
    await supabase.from('posts').delete().eq('id', postId);
    toast('삭제 완료!', { className: 'post-alert', position: 'top-center' });
  } catch (error) {
    console.error('Error deleting post and likes:', error);
  }
};
