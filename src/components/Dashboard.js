import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import "./Dashboard.css";
import Card from "./Card";

const Dashboard = () => {
  const navigate = useNavigate();
  const [emailFrmJira, setEmail] = useState("");
  const [name, setName] = useState("");
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(true);

  // console.log(issues);
  
  const onLogoutSuccess = () => {
    localStorage.clear();
    googleLogout(); // Call the googleLogout function
    console.log("Logged out successfully");
    navigate("/");
  };

  useEffect(() => {
    // Retrieve and set email and name once on component mount
    const storedName = localStorage.getItem("displayName");
    const emailjira = localStorage.getItem("email");
    if (storedName) {
        setName(storedName);
    }
    if (emailjira) {
        setEmail(emailjira);
    }
}, []);

useEffect(() => {
    const tokenid = localStorage.getItem('tokenid');
    const emailjiraa = localStorage.getItem("email");

    // Proceed only if both tokenid and email are available
    if (tokenid && emailjiraa) {
        const fetchIssues = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/issues?email=${emailjiraa}&token=${tokenid}`);
                if (response.ok) {
                    const data = await response.json();
                    setIssues(data.issues); // Adjust based on actual API response structure
                    console.log(data);
                } else {
                    setError('Failed to fetch issues');
                }
            } catch (err) {
                console.error('Error fetching issues:', err);
                setError('Server error');
            } finally {
                setLoading(false);
            }
        };

        fetchIssues();
    }
}, [emailFrmJira]); // Run only when emailFrmJira is set

  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonClick = (button) => {
    // Toggle selection: deselect if the button is already selected, otherwise select it
    setSelectedButton((prevButton) => (prevButton === button ? null : button));
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

      <input type="text" id="search_issue" placeholder="Search an issue" /> &nbsp;&nbsp;&nbsp;{" "}
      <button id="open_ticket">Open a ticket</button>
      <br /><br />

      <div id="multiple_btns">
        <button
          className={`active_btns ${selectedButton === "button1" ? "selected" : ""}`}
          onClick={() => handleButtonClick("button1")}
        >
          Assigned to You
        </button>
        &nbsp;&nbsp;&nbsp;
        {/* Button 2 */}
        <button
          className={`active_btns ${selectedButton === "button2" ? "selected" : ""}`}
          onClick={() => handleButtonClick("button2")}
        >
          Created by You
        </button>
      </div>


      <div className="cards_holder">
                {loading && <p>Loading issues...</p>}
                {error && <p>{error}</p>}
                {selectedButton === "button1" && issues.length > 0 && issues.map(issue => (
                    <Card key={issue.id} issue={issue} />
                ))}
                {selectedButton === "button1" && issues.length === 0 && <p>No issues assigned to you.</p>}
                {selectedButton === "button2" && <p>Created by me section</p>}
            </div>

    </div>
    
    </>
  );
};

export default Dashboard;
