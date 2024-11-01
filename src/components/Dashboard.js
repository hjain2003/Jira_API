import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import "./Dashboard.css";
import Card from "./Card";

const ITEMS_PER_PAGE = 5;

const Dashboard = () => {
  const navigate = useNavigate();
  const [emailFrmJira, setEmail] = useState("");
  const [name, setName] = useState("");
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [createdIssues, setCreatedIssues] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignedPage, setAssignedPage] = useState(1);
  const [createdPage, setCreatedPage] = useState(1);
  const [selectedButton, setSelectedButton] = useState(null);

  const onLogoutSuccess = () => {
    localStorage.clear();
    googleLogout();
    navigate("/");
  };

  useEffect(() => {
    const storedName = localStorage.getItem("displayName");
    const emailjira = localStorage.getItem("email");
    if (storedName) setName(storedName);
    if (emailjira) setEmail(emailjira);

    const fetchIssues = async () => {
      const tokenid = localStorage.getItem("tokenid");
      try {
        const assignedResponse = await fetch(
          `http://localhost:5000/api/issues/assigned?email=${emailjira}&token=${tokenid}`
        );
        if (assignedResponse.ok) {
          const data = await assignedResponse.json();
          setAssignedIssues(data.issues);
        } else {
          setError("Failed to fetch assigned issues");
        }

        const createdResponse = await fetch(
          `http://localhost:5000/api/issues/created?email=${emailjira}&token=${tokenid}`
        );
        if (createdResponse.ok) {
          const data = await createdResponse.json();
          setCreatedIssues(data.issues);
        } else {
          setError("Failed to fetch created issues");
        }
      } catch (err) {
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const handleButtonClick = (button) => {
    setSelectedButton((prevButton) => (prevButton === button ? null : button));
  };

  const nextPage = (type) => {
    if (type === "assigned" && assignedPage * ITEMS_PER_PAGE < assignedIssues.length) {
      setAssignedPage(assignedPage + 1);
    } else if (type === "created" && createdPage * ITEMS_PER_PAGE < createdIssues.length) {
      setCreatedPage(createdPage + 1);
    }
  };

  const prevPage = (type) => {
    if (type === "assigned" && assignedPage > 1) {
      setAssignedPage(assignedPage - 1);
    } else if (type === "created" && createdPage > 1) {
      setCreatedPage(createdPage - 1);
    }
  };

  const getPaginatedIssues = (issues, page) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return issues.slice(start, end);
  };

  return (
    <>
      <div>
        <nav>
          <span>
            <h1>DigitalXForce Ticket Raising Platform</h1>
          </span>
          <div id="rightspan">
            {emailFrmJira} &nbsp;&nbsp;&nbsp;
            <button onClick={onLogoutSuccess}>Logout</button>
          </div>
        </nav>

        <div className="greeting">
          <h2>Hello, {name}</h2>
        </div>
        <br />

        <input type="text" id="search_issue" placeholder="Search an issue" /> &nbsp;&nbsp;&nbsp;
        <button id="open_ticket">Open a ticket</button>
        <br /><br />

        <div id="multiple_btns">
          <button
            className={`active_btns ${selectedButton === "button1" ? "selected" : ""}`}
            onClick={() => handleButtonClick("button1")}
          >
            <b>Assigned to You</b> ({assignedIssues.length})
          </button>
          &nbsp;&nbsp;&nbsp;
          <button
            className={`active_btns ${selectedButton === "button2" ? "selected" : ""}`}
            onClick={() => handleButtonClick("button2")}
          >
            <b>Created by You </b>({createdIssues.length})
          </button>
        </div>

        <div className="cards_holder">
          {loading && <p>Loading issues...</p>}
          {error && <p>{error}</p>}

          {selectedButton === "button1" && (
            <>
              {getPaginatedIssues(assignedIssues, assignedPage).map((issue) => (
                <Card key={issue.id} id={issue.id} issue={issue} assignee={issue.fields.assignee.displayName} showCreator={true} showAssignee={false} />
              ))}
              {assignedIssues.length > ITEMS_PER_PAGE && (
                <div>
                  <button className="pagination_btns" onClick={() => prevPage("assigned")} disabled={assignedPage === 1}>
                    Previous
                  </button>
                  <br/>
                  <button className="pagination_btns" onClick={() => nextPage("assigned")} disabled={assignedPage * ITEMS_PER_PAGE >= assignedIssues.length}>
                    Next
                  </button>
                </div>
              )}
            </>
          )}

          {selectedButton === "button2" && (
            <>
              {getPaginatedIssues(createdIssues, createdPage).map((issue) => (
                <Card key={issue.id} id={issue.id} issue={issue} assignee={issue.fields.assignee ? issue.fields.assignee.displayName : "Unassigned"} showCreator={false} showAssignee={true}/>
              ))}
              {createdIssues.length > ITEMS_PER_PAGE && (
                <div>
                  <button className="pagination_btns" onClick={() => prevPage("created")} disabled={createdPage === 1}>
                    Prev
                  </button><br/><br/>
                  <button className="pagination_btns" onClick={() => nextPage("created")} disabled={createdPage * ITEMS_PER_PAGE >= createdIssues.length}>
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
