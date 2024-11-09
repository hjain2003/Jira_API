import React, { useState } from 'react'
import './Card.css';

const Card = ({issue,id,assignee,showCreator, showAssignee}) => {
    // const { id, key, fields } = issue;
    const [boxopen,setboxopen] = useState(false);
    const [updateboxopen,setupdatebxopen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [statusOptions, setStatusOptions] = useState([
        { id: 11, name: 'To Do' },
        { id: 21, name: 'In Progress' },
        { id: 31, name: 'Done' }
    ]);


    const openMoreBox=()=>{
        setboxopen(true);
    }

    const closeMoreBox=()=>{
        setboxopen(false);
    }

    const openUpdatebox=()=>{
        setupdatebxopen(true);
    }

    const closeUpdatebox = () => {
        setupdatebxopen(false);
    }

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    const handleUpdateStatus = async () => {
        alert("Status updated to:" + selectedStatus);
        // const email = localStorage.getItem('email');
        // const token = localStorage.getItem('token');

        // const updateDetails={
        //     transition:{
        //         id:selectedStatus
        //     }
        // }
        // console.log("Creating issue with data:", JSON.stringify(updateDetails, null, 2));
        // try {
        //     const response = await fetch(`http://localhost:5000/api/issues/update/${id}`, {
        //         method: 'POST',
        //         headers: {
        //             'Authorization': `Basic ${btoa(`${email}:${token}`)}`,
        //             'Content-Type': 'application/json',
        //         },
        //         credentials:'include'
        //         // body: JSON.stringify(updateDetails)
        //     });

           

        //     if (response.ok) {
        //         alert('Status updated successfully');
        //         closeUpdatebox(); // Close the update box after successful update
        //     } else {
        //         alert('Error updating status');
        //     }
        // } catch (error) {
        //     console.error('Error updating status:', error);
        //     alert('Server error while updating status');
        // }
    }


    const addComment=()=>{
        alert("Comment appended for the issue id: " + id);
    }
  return (
    <>
    {
        boxopen &&
        <div className='more_box_div'>
            <h2 align="center">MORE INFORMATION</h2>
            <br/>
            <hr/>
            <b>TICKET ID: {id}</b>
            <br/>
            {issue.fields.description.content[0].content[0].text}
            <button id="close_more_box" onClick={closeMoreBox}>Close</button>
        </div>
    }

    {updateboxopen && 
        <div id="update_box">
        <h2 align="center">UPDATE TICKET</h2>
            <br/>
            <hr/>
            <b>TICKET ID: {id}</b>
            <br/>
            <label htmlFor="status">Select New Status:</label>
                    <select id="status" value={selectedStatus} onChange={handleStatusChange}>
                        <option value="">--Select Status--</option>
                        {statusOptions.map(option => (
                            <option key={option.id} value={option.id}>{option.name}</option>
                        ))}
                    </select>
                    
                    <button onClick={handleUpdateStatus}>Update Status</button>
                    <br/>
                    <label>Add a comment: </label>
                    <textarea></textarea>
                    <button onClick={addComment}>Add comment</button>
                    <br/>
                    <button onClick={() => setupdatebxopen(false)}>Cancel</button>
                </div>
    }
    <div className='card_box'>
        <div className='card_box_top_row'>

            <div className='left_side_wrapper'>
                <div id='id'>{id}</div>
                <div id='issue_type'>{issue.fields.issuetype.name}</div>
            </div>

            <div id='priority'>{issue.fields.priority.name}</div>

            
        </div>
        
        <div className='other_info'>
            <b>Project Name</b> {issue.fields.project.name}<br/>
            <b>Opened on</b> {new Date(issue.fields.created).toLocaleString()}<br/>
            <b>Status </b>{issue.fields.status.name} <br/>
            {/* Conditionally render the "Created by" and "Assigned to" fields */}
        {showCreator && <><b>Created by</b> {issue.fields.creator.displayName} <br/></>}
        {showAssignee && <><b>Assigned to</b> {assignee}<br/></>}
            <b>Brief description &nbsp;&nbsp;<button id="show_more" onClick={openMoreBox}>More</button> </b>{issue.fields.summary} 
        </div>
        <br/>
        <button id="change_status" onClick={openUpdatebox}>Update Status</button><br/>
    </div>
        
    </>
  )
}

export default Card
