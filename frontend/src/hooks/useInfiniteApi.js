import { useEffect, useState } from "react";
import useApi from "./useApi";
import useIntersectionObserver from "./useIntersectionObserver";

const mergeObjects = (obj1, obj2) => {
    const mergedObject = { ...obj1 };
    for (const [key, value] of Object.entries(obj2)) {
        if (obj1[key] && Array.isArray(value)) {
            mergedObject[key] = [...obj1[key], ...value];
            break;
        }
        mergedObject[key] = value;
    }
    return mergedObject;
}

const useInfiniteApi = (cb, onSuccess = null, deps) => {
    const { data, setData, loading, error } = useApi(cb, deps);
    const { isIntersecting, stopObserver } = useIntersectionObserver(".load-more");
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(2);

    useEffect(() => {
        let stale = false;
        if (!loading && !loadingMore && hasMore && isIntersecting) {
            cb(page).then(response => {
                if (!stale) {
                    setLoadingMore(true);
                }
                if (response.ok && !stale) {
                    response.json().then(newData => {
                        if (!newData.hasMore) {
                            stopObserver();
                            setHasMore(false);
                        }
                        else {
                            setData(data => mergeObjects(data, newData));
                            setPage(page => page + 1);
                            onSuccess && onSuccess();
                        }
                        setLoadingMore(false);
                    })
                }
            })
        }

        return () => {
            stale = true;
        }
    }, [loading, loadingMore, hasMore, page, isIntersecting, cb, setData, stopObserver]);

    return { data, setData, loading, loadingMore, error };
};

export default useInfiniteApi;