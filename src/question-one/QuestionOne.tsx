import React, { useState, useRef, useEffect } from "react";
import { IDataService, Job } from "../common/types";

import { SectionGroup } from "../components/section/SectionGroup";
import { SectionPanel } from "../components/section/SectionPanel";
import { DataService } from "../service/DataService";

import dayjs from 'dayjs';

import "./QuestionOne.css";

export const QuestionOne: React.FC<{ service: IDataService }> = () => {
  const [result, setResult] = useState([] as any);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleIsLoading = () => {
    setIsLoading((current) => !current);
  };

  useEffect(() => {
    console.log("isLoading is: ", isLoading);
  }, [isLoading]);

  const debounce = (func: any, timeout: any) => {
    let timer: NodeJS.Timeout;
    return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  };

  const fetchJobs = async (key: any) => {
    setKeyword(key);
    if (key.trim().length >= 3) {
      toggleIsLoading();
      await DataService.getJobsWithSearchTerm(key).then((res) => {
        toggleIsLoading();
        setResult(res);
      });
    } else if (key.trim().length === 0) {
      setResult([]);
    }
  };

  const debounceFetch = useRef(
    debounce((value: any) => fetchJobs(value), 500)
  ).current;

  const handleInputOnChange = (e: any) => {
    const { value } = e.target;
    debounceFetch(value);
  };

  return (
    <SectionGroup>
      <SectionPanel>
        <label>
          Search <span>&nbsp;</span>
          <input
            type="text"
            placeholder="Search"
            onChange={handleInputOnChange}
          />
        </label>
        {isLoading ? (
          <p>fetching jobs...</p>
        ) : result.length > 0 ? (
          result.map((res: Job, i: number) => (
            <div key={i} className="job-item">
              <span className="fw-bold">Name: </span>
              {res.name}
              <br />
              <span className="fw-bold">Start date: </span>
              {dayjs(res.start).format('ddd MMM DD YYYY hh:mm A')}
              <br />
              <span className="fw-bold">End date: </span>
              {dayjs(res.end).format('ddd MMM DD YYYY hh:mm A')}
              <br />
              <span className="fw-bold">Contact Id: </span>
              {res.contactId}
              <br />
            </div>
          ))
        ) : keyword.length < 3 ? (
          <p>Please type at least 3 characters to search</p>
        ) : <p>No job found</p> }
        {result.length > 0 && <p className="text-center">Please clear the search field to clear job results</p>}
      </SectionPanel>
    </SectionGroup>
  );
};
