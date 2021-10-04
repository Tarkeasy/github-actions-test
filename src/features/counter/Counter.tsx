import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { fetchUsersAsync, selectUsers } from './counterSlice';
import { useGetPostsQuery } from './usersAPI';
import styles from './Counter.module.css';
import { unwrapResult } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export function Counter() {
  const users = useAppSelector((state: RootState) =>
    selectUsers.selectById(state, 10)
  );
  const { data } = useGetPostsQuery();
  console.log('data', data);
  const dispatch = useAppDispatch();
  console.log('users', users);

  return <div></div>;
}
