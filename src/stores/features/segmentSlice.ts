import { Segment } from "@/interfaces/Segment";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  segments: [] as Segment[],
};

export const segmentSlice = createSlice({
  name: "segments",
  initialState,
  reducers: {
    setSegments: (state, action: PayloadAction<Segment[]>) => {
      state.segments = action.payload;
    },
    clearSegments: (state) => {
      state.segments = [];
    },
    setSegment: (state, action: PayloadAction<Segment>) => {
      state.segments.push(action.payload);
    },
    setUpdateSegment: (state, action: PayloadAction<Segment>) => {
      const updatedSegment = action.payload;
      const index = state.segments.findIndex(
        (segment) => segment.id === updatedSegment.id
      );
      if (index !== -1) {
        state.segments[index] = updatedSegment;
      }
    },
    setDeleteSegment: (state, action: PayloadAction<number>) => {
      const SegmentToDelete = action.payload;
      const index = state.segments.findIndex(
        (segment) => segment.id === SegmentToDelete
      );
      if (index !== -1) {
        state.segments.splice(index, 1); // Elimina el elemento en la posición `index`
      }
    },
  },
});

export const { setSegments, clearSegments, setSegment, setUpdateSegment, setDeleteSegment } = segmentSlice.actions;
export default segmentSlice.reducer;