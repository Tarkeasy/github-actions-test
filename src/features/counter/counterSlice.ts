import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  createReducer,
  createEntityAdapter,
  SerializedError,
} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { fetchUsers } from './usersAPI';

export interface BaseState {
  status: 'idle' | 'loading' | 'failed';
  error: Error | SerializedError | null;
}

export type IUser = {
  id: number;
  name: string;
};

const usersAdapter = createEntityAdapter<IUser>({
  // Assume IDs are stored in a field other than `name.id`
  selectId: (user) => user.id,
  // Keep the "all IDs" array sorted based on user name
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export const fetchUsersAsync = createAsyncThunk(
  'users/fetchUsersAsync',
  async (_, { rejectWithValue }, ...res) => {
    try {
      const result = await fetchUsers();
      // The value we return becomes the `fulfilled` action payload
      return result;
    } catch (e) {
      return rejectWithValue('Error payload');
    }
  },
  {
    condition: (userId, { getState, extra }) => {
      const {
        users: { ids },
      } = getState() as RootState;
      // if there are already data in the store, don't fetch data, cancel action
      if (ids.length) {
        return false;
      }
    },
  }
);

export const counterSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState<BaseState>({
    status: 'idle',
    error: null,
  }),
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        usersAdapter.setAll(state, action.payload);
      })
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.error;
      });
  },
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectUsers = usersAdapter.getSelectors<RootState>(
  (state) => state.users
);

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.

export default counterSlice.reducer;

export const {} = counterSlice.actions;
