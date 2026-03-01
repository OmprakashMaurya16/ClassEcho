import { useState, useEffect } from "react";
import { facultyAPI, feedbackAPI, departmentAPI } from "../services/api";

export const useFacultyList = (department = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = department
        ? await facultyAPI.getByDepartment(department)
        : await facultyAPI.getAll();
      setData(response.data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching faculty:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, [department]);

  return { data, loading, error, refetch: fetchFaculty };
};

export const useFaculty = (id) => {
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFaculty = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await facultyAPI.getById(id);
      setFaculty(response.data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching faculty:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, [id]);

  return { faculty, loading, error, refetch: fetchFaculty };
};

export const useFeedbackAnalytics = (facultyId) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    if (!facultyId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await feedbackAPI.getAnalytics(facultyId);
      setAnalytics(response.data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [facultyId]);

  return { analytics, loading, error, refetch: fetchAnalytics };
};

export const useDepartmentAnalytics = (department) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    if (!department) return;

    try {
      setLoading(true);
      setError(null);
      const response = await departmentAPI.getAnalytics(department);
      setAnalytics(response.data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching department analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [department]);

  return { analytics, loading, error, refetch: fetchAnalytics };
};

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  };

  return [storedValue, setValue];
};
