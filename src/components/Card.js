import React from 'react'
import './Card.css';

const Card = ({issue}) => {
    // const { id, key, fields } = issue;
  return (
    <>
    <div className='card_box'>
        <div className='card_box_top_row'>

            <div className='left_side_wrapper'>
                <div id='id'>{issue.key}</div>
                <div id='issue_type'>{issue.fields.issuetype.name}</div>
            </div>

            <div id='priority'>{issue.fields.priority.name}</div>

            
        </div>
        <br/>
        <div className='other_info'>
            <b>Project Name:</b> {issue.fields.project.name}<br/>
            <b>Opened on: </b> {new Date(issue.fields.created).toLocaleString()}<br/>
            <b>Status: </b>{issue.fields.status.name} <br/>
            <b>Created by: </b>{issue.fields.creator.displayName} <br/>
            <b>Brief description: </b>{issue.fields.summary}
        </div>
        <br/>
        <button id="change_status">Change Status</button>
    </div>
        
    </>
  )
}

export default Card
