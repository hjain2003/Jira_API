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
  const [issueboxopen, setissueboxopen] = useState(false);
  //issue form
  const [summary, setSummary] = useState("");
  const [issueKey, setIssueKey] = useState("");
  const [issueDescription, setDescription] = useState("");
  const [issueType, setIssueType] = useState("Bug");
  const [priorityset, setPriority] = useState("Medium");
  const [assigneeEmail, setAssigneeEmail] = useState("");
  const [assigneeId, setAssigneeId] = useState("");

  //search
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredIssues, setFilteredIssues] = useState([]);

  //sorting
  const [sortCriteria, setSortCriteria] = useState("priority"); // default sort by priority
  const [sortOrder, setSortOrder] = useState("ascending"); // ascending or descending

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filteredAssigned = assignedIssues.filter(
      (issue) => issue.id.toString().includes(query) // Assuming `id` is the field you want to search by
    );

    const filteredCreated = createdIssues.filter((issue) => issue.id.toString().includes(query));

    setFilteredIssues([...filteredAssigned, ...filteredCreated]); // Combine both results if needed
  };

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

  const openIssueBox = () => {
    setissueboxopen(true);
  };
  const closeissuebox = () => {
    setissueboxopen(false);
  };

  const fetchAssigneeId = async () => {
    const tokenid = localStorage.getItem("tokenid");
    try {
      const response = await fetch(
        `http://localhost:5000/api/user/search?query=${assigneeEmail}&email=${emailFrmJira}&token=${tokenid}`
      );

      if (response.ok) {
        const data = await response.json();
        setAssigneeId(data.accountId);
        alert("Account ID fetched successfully : " + assigneeId);
      } else {
        alert("Invalid email");
      }
    } catch (error) {
      console.error("Error fetching assignee ID:", error);
    }
  };

  const createIssue = async () => {
    alert("Issue Created!");
    // if (!summary || !issueDescription || !assigneeEmail || !issueType) {
    //   alert("Please fill in all the required fields.");
    //   return;
    // }
    // console.log(summary);
    // console.log(issueDescription);
    // console.log(issueType);
    // console.log(priorityset);
    // console.log(assigneeEmail);
    // console.log(assigneeId);
    // const emailFrmJiraa = localStorage.getItem("email");
    // const tokenid = localStorage.getItem("tokenid");
    // const issueData = {
    //   fields: {
    //     project: {key: "SCRUM"},
    //     summary,
    //       description: {
    //       type: "doc",
    //       version: 1,
    //       content: [
    //         {
    //           type: "paragraph",
    //           content: [
    //             {
    //               type: "text",
    //               text: issueDescription
    //             }
    //           ]
    //         }
    //       ]
    //     },
    //     // description:"This is big description",
    //     issuetype: {name: issueType},
    //     priority: {name: priorityset },
    //     assignee: {id: assigneeId},
    //   },
    // };
    // console.log("Creating issue with data:", JSON.stringify(issueData, null, 2));
    // try {
    //   const response = await fetch(`http://localhost:5000/api/issues/create?email=${emailFrmJiraa}&token=${tokenid}`,{
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(issueData),
    //   });
      

    //   if (response.ok) {
    //     // console.log("Issue payload:", JSON.stringify(issueData, null, 2));

    //     alert("Issue created successfully!");
    //     closeissuebox();
    //   } else {
    //     // console.log("Issue payload:", JSON.stringify(issueData, null, 2));

    //     const errorData = await response.json();
    //     console.log("Failed to create issue:", errorData.message || "Unknown error");
    //     alert("Failed to create issue: " + (errorData.message || "Unknown error"));
    //   }
    // } catch (error) {
    //   console.error("Error creating issue:", error);
    // }
  };

  const sortIssues = (issues) => {
    const sortedIssues = [...issues]; // create a shallow copy to avoid mutating state
    if (sortCriteria === "priority") {
      sortedIssues.sort((a, b) => {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return sortOrder === "ascending"
          ? priorityOrder[a.fields.priority.name] - priorityOrder[b.fields.priority.name]
          : priorityOrder[b.fields.priority.name] - priorityOrder[a.fields.priority.name];
      });
    } else if (sortCriteria === "issueType") {
      sortedIssues.sort((a, b) => {
        const issueTypeOrder = { Bug: 1, Task: 2, Improvement: 3 };
        return sortOrder === "ascending"
          ? issueTypeOrder[a.fields.issuetype.name] - issueTypeOrder[b.fields.issuetype.name]
          : issueTypeOrder[b.fields.issuetype.name] - issueTypeOrder[a.fields.issuetype.name];
      });
    }
    return sortedIssues;
  };

  return (
    <>
      {issueboxopen && (
        <div id="issue_box_div">
          <h2 align="center">NEW TICKET</h2>
          <br />
          <hr />
          {/* <label>Project Key:</label> */}
          {/* <input type="text" value={issueKey} onChange={(e) => setIssueKey(e.target.value)} required /> */}
          <label>Issue Type</label>

          <select value={issueType} onChange={(e) => setIssueType(e.target.value)}>
            <option value="Bug">Bug</option>
            <option value="Task">Task</option>
            <option value="Improvement">Improvement</option>
          </select>
          <label>Description</label>
          <textarea value={issueDescription} onChange={(e) => setDescription(e.target.value)} />
          <label>Summary</label>
          <input type="text" value={summary} onChange={(e) => setSummary(e.target.value)} />

          <label>Priority:</label>
          <select value={priorityset} onChange={(e) => setPriority(e.target.value)}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <label>Assignee Email:</label>
          <input type="text" value={assigneeEmail} onChange={(e) => setAssigneeEmail(e.target.value)} />
          <button onClick={fetchAssigneeId}>Get Assignee ID</button>
          <br />
          <button onClick={createIssue}>Create Issue</button>
          <br />

          <button id="close_issue_box" onClick={closeissuebox}>
            Close
          </button>
        </div>
      )}
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
        <input
          type="text"
          id="search_issue"
          placeholder="Search an issue"
          value={searchQuery}
          onChange={handleSearch}
        />
        &nbsp;&nbsp;
        <select value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value)} className="filtering_btns">
          <option value="priority">Sort by Priority</option>
          <option value="issueType">Sort by Issue Type</option>
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="filtering_btns">
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>
        <br/><br/>
        <button id="open_ticket" onClick={openIssueBox}>
          Open a ticket
        </button>
        <br />
        <br />
        <br />
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

          {searchQuery && filteredIssues.length > 0 && (
            <Card
              key={filteredIssues[0].id}
              id={filteredIssues[0].id}
              issue={filteredIssues[0]}
              assignee={filteredIssues[0].fields.assignee.displayName}
              showCreator={true}
              showAssignee={false}
            />
          )}

          {selectedButton === "button1" && (
            <>
              {sortIssues(getPaginatedIssues(assignedIssues, assignedPage)).map((issue) => (
                <Card
                  key={issue.id}
                  id={issue.id}
                  issue={issue}
                  assignee={issue.fields.assignee.displayName}
                  showCreator={true}
                  showAssignee={false}
                />
              ))}
              {assignedIssues.length > ITEMS_PER_PAGE && (
                <div>
                  <button
                    className="pagination_btns"
                    onClick={() => prevPage("assigned")}
                    disabled={assignedPage === 1}
                  >
                    Previous
                  </button>
                  <br />
                  <button
                    className="pagination_btns"
                    onClick={() => nextPage("assigned")}
                    disabled={assignedPage * ITEMS_PER_PAGE >= assignedIssues.length}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

          {selectedButton === "button2" && (
            <>
              {sortIssues(getPaginatedIssues(createdIssues, createdPage)).map((issue) => (
                <Card
                  key={issue.id}
                  id={issue.id}
                  issue={issue}
                  assignee={issue.fields.assignee ? issue.fields.assignee.displayName : "Unassigned"}
                  showCreator={false}
                  showAssignee={true}
                />
              ))}
              {createdIssues.length > ITEMS_PER_PAGE && (
                <div>
                  <button className="pagination_btns" onClick={() => prevPage("created")} disabled={createdPage === 1}>
                    Prev
                  </button>
                  <br />
                  <br />
                  <button
                    className="pagination_btns"
                    onClick={() => nextPage("created")}
                    disabled={createdPage * ITEMS_PER_PAGE >= createdIssues.length}
                  >
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
