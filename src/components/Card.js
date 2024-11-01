import React, { useState } from 'react'
import './Card.css';

const Card = ({issue,id,assignee,showCreator, showAssignee}) => {
    // const { id, key, fields } = issue;
    const [boxopen,setboxopen] = useState(false);

    const openMoreBox=()=>{
        setboxopen(true);
    }

    const closeMoreBox=()=>{
        setboxopen(false);
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
        <button id="change_status">Update Status</button><br/>
    </div>
        
    </>
  )
}

export default Card
