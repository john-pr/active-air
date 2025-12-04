import { useEffect, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.js";
import { fetchIndexByStationId } from "../model/indicesSlice.js";
import { selectIndicesById, selectIndexStatusById } from "../model/indicesSelectors.js";

export function useIndicesForViewport(stationsInView = []) {
  const dispatch = useAppDispatch();
  const indicesById = useAppSelector(selectIndicesById);
  const statusById = useAppSelector(selectIndexStatusById);

  const idsInView = useMemo(
      () => stationsInView.map(s => String(s.id)),
      [stationsInView]
  );

  const missingIds = useMemo(() => {
    return idsInView.filter(id => {
      const hasData = indicesById[id] != null;
      const isLoading = statusById[id] === "loading";
      return !hasData && !isLoading;
    });
  }, [idsInView, indicesById, statusById]);

  const cancelRef = useRef(false);
  const timersRef = useRef([]);

  useEffect(() => {
    if (missingIds.length === 0) return;

    // cancel previous run
    cancelRef.current = true;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    cancelRef.current = false;

    let pointer = 0;

    const runBatch = () => {
      if (cancelRef.current) return;

      const batch = missingIds.slice(pointer, pointer + 20);

      batch.forEach(id => {
        if (indicesById[id] == null && statusById[id] !== "loading") {
          dispatch(fetchIndexByStationId(id));
        }
      });

      pointer += 20;
      if (pointer < missingIds.length) {
        const t = setTimeout(runBatch, 250);
        timersRef.current.push(t);
      }
    };

    runBatch();

    return () => {
      cancelRef.current = true;
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [missingIds, indicesById, statusById, dispatch]);

  return indicesById;
}
