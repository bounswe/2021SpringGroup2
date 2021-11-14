import React, { useEffect, useState} from 'react'
import Typography from "@material-ui/core/Typography";
import {url} from "../App";

export default function EventCreator(props){
    let {id} = props
    const [comment, setC] = useState([{answer: "a"}])
    useEffect(_=>{
        getUser(id)
    })
    const getUser = id =>{
        fetch(url+"api/v1.0/events/"+id+"/comments"+props.c.commentID+"/answers")
            .then(r=>r.json())
            .then(setC)
            .catch(e=>console.log(e))
    }

    return(
        <React.Fragment>
            <Typography variant="body1" color={"textSecondary"}>
                {props.c.comment}
            </Typography>
            {
                comment.map(c=>{
                    return <Typography variant="body1" color={"textSecondary"} style={{marginLeft: 50}}>
                        {c.answer}
                    </Typography>

                })
            }


        </React.Fragment>
    )
}
