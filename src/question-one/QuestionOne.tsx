import React, { useState, useRef, useEffect } from "react";
import { IDataService, Job } from "../common/types";

import { SectionGroup } from "../components/section/SectionGroup";
import { SectionPanel } from "../components/section/SectionPanel";
import { DataService } from "../service/DataService";

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
    if (key.length >= 3) {
      toggleIsLoading();
      await DataService.getJobsWithSearchTerm(key).then((res) => {
        toggleIsLoading();
        setResult(res);
      });
    } else if (key.length === 0) {
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
            <div key={i}>
              <br />
              {"Name: "}
              {res.name}
              {", "}
              <br />
              {"Start date: "}
              {res.start}
              {", "}
              <br />
              {"End date: "}
              {res.end}
              {", "}
              <br />
              {"Contact Id: "} {res.contactId}
              <br />
            </div>
          ))
        ) : keyword.length < 3 ? (
          <p>Please type at least 3 characters to search</p>
        ) : <p>No job found</p> }
      </SectionPanel>
    </SectionGroup>
  );
};
