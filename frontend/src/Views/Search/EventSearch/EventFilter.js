import React from 'react'
import Typography from "@mui/material/Typography";
import SportType from "./FilterComponents/SportType";
import MinSkillLevel from "./FilterComponents/MinSkillLevel";
import MaxSkillLevel from "./FilterComponents/MaxSkillLevel";
import AgeGroups from "./FilterComponents/AgeGroups";
import Players from "./FilterComponents/Players";
import MinCreationDate from "./FilterComponents/MinCreationDate";
import MaxCreationDate from "./FilterComponents/MaxCreationDate";
import MinDate from "./FilterComponents/MinDate";
import MaxDate from "./FilterComponents/MaxDate";
import Paper from "@mui/material/Paper";


export default  function EventFilter(props){



    return(
        <Paper
            className={props.classes.paper}>
            <Typography component="h1" variant="h5">
                Filters
            </Typography>

            <div>  {props.space}  </div>
            <SportType
                text={"Sport Type"}
                {...props.filters}
                id={"sport"}
                setValue={props.setValue}
            />
            <MinSkillLevel
                {...props.filters}
                id={"min_skill_level"}
                setValue={props.setValue}
            />
            <div>  {props.space}  </div>
            <MaxSkillLevel
                {...props.filters}
                id={"max_skill_level"}
                setValue={props.setValue}
            />
            <div>  {props.space}  </div>
            <AgeGroups
                {...props.filters}
                ids={["min_age","max_age"]}
                setValue={props.setValues}
            />
            <div>  {props.space}  </div>
            <Players
                text={"Players Range"}
                {...props.filters}
                ids={["min_players","max_players"]}
                setValue={props.setValues}
            />
            <div>  {props.space}  </div>
            <Players
                text={"Spectators Range"}
                {...props.filters}
                ids={["min_spectators","max_spectators"]}
                setValue={props.setValues}
            />
            <div>  {props.space}  </div>
            <Players
                text={"Player Capacity Range"}
                {...props.filters}
                ids={["min_player_capacity","max_player_capacity"]}
                setValue={props.setValues}
            />
            <div>  {props.space}  </div>
            <Players
                text={"Spectator Capacity Range"}
                {...props.filters}
                ids={["min_spectator_capacity","max_spectator_capacity"]}
                setValue={props.setValues}/>
            <div>  {props.space}  </div>
            <MinCreationDate
                {...props.filters}
                id={"min_creation_date"}
                setValue={props.setValue}
            />
            <div>  {props.space}  </div>
            <MaxCreationDate
                {...props.filters}
                id={"max_creation_date"}
                setValue={props.setValue}
            />
            <div>  {props.space}  </div>
            <MinDate
                {...props.filters}
                id={"min_date"}
                setValue={props.setValue}
            />
            <div>  {props.space}  </div>
            <MaxDate
                {...props.filters}
                id={"max_date"}
                setValue={props.setValue}
            />
        </Paper>
    )
}