import { useEffect } from "react";
import { useState } from "react";

const useApi = (cb) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let stale = false;
        cb().then(response => {
            if (response.ok) {
                response.json().then(jsonData => {
                    if (!stale) {
                        setData(jsonData);
                    }
                });
                setLoading(false);
            }
        }).catch(error => setError(error));

        return () => {
            stale = true;
        }
    }, []);

    return { data, setData, loading, error };
}

export default useApi