import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    }
  }
})

// Action creators
export const { setUser } = userSlice.actions

// Reducer
export default userSlice.reducer
