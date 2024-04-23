import React, { Component } from "react";


import PropTypes from "prop-types";
import Tabs from "@material-ui/core/Tabs/Tabs";
import Tab from "@material-ui/core/Tab/Tab";
import Typography from "@material-ui/core/Typography/Typography";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import Button from "@material-ui/core/Button/Button";
import TextField from "@material-ui/core/TextField/TextField";
import Radio from "@material-ui/core/Radio/Radio";
import RadioGroup from "@material-ui/core/RadioGroup/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import FormControl from "@material-ui/core/FormControl/FormControl";
import FormLabel from "@material-ui/core/FormLabel/FormLabel";

import { connect } from "react-redux";

import { login, newRoom } from "../actions";

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  formControl: {
    margin: theme.spacing.unit * 3
  },
  group: {
    margin: `${theme.spacing.unit}px 0`
  }
});

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0,
      formValue: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.createRoom = this.createRoom.bind(this);
    this.selectRoom = this.selectRoom.bind(this);
  }

  createRoom() {
    const room = document.getElementById("chatroomCreateName").value;
    const username = document.getElementById("create-username").value;
    const { app } = this.props;
    let error = false;

    if (username.length === 0) {
      alert("Please enter a username.");
      return;
    }

    if (room.length === 0) {
      alert("Please provide a chatroom name.");
      return;
    }

    if (app.rooms.length === null) {
      return;
    }

    app.rooms.forEach(function(element) {
      if (room === element.name) error = true;
    });
    if (error) {
      alert("Chatroom name already taken. Enter another name");
    } else {
      this.props.dispatch(newRoom({ room }));
      this.props.dispatch(login({ username, room }));
    }
  }

  selectRoom(room) {
    const username = document.getElementById("join-username").value;
    const { formValue } = this.state;
    let error = false;

    if (username.length === 0) {
      alert("Username cannot be blank.");
      return;
    }
    if (formValue === null) {
      alert("Please select a room. If there are no rooms, you can create one.");
      return;
    } else {
      let room = formValue;
      this.props.dispatch(login({ username, room }));
    }
  }

  handleKeyPress() {
    if (event.key === "Enter") {
      switch (this.state.value) {
        case 0:
          this.selectRoom.bind(this);

        case 1:
          this.createRoom.bind(this);
      }
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleFormChange = event => {
    this.setState({ formValue: event.target.value });
  };

  render() {
    const { app, users } = this.props;
    const { value, formValue } = this.state;

    return (
      <Dialog aria-labelledby="form-dialog-title" open={true}>
        <DialogTitle id="form-dialog-title">
          Login to play
        </DialogTitle>
        <Tabs value={value} onChange={this.handleChange}>
          <Tab label="Join Chatroom" />
          <Tab label="Create Chatroom" />
        </Tabs>
        {value === 0 && (
          <TabContainer>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="join-username"
                label="Username"
                type="text"
                fullWidth
                onKeyPress={this.handleKeyPress.bind(this)}
              />
              <br />
              <br />
              <br />
              <br />
              <FormControl component="fieldset">
                <FormLabel component="legend">Rooms</FormLabel>
                <RadioGroup
                  aria-label="Room"
                  name="chatroom"
                  value={formValue}
                  onChange={this.handleFormChange}
                >
                  {app.rooms.map((item, index) => (
                    <FormControlLabel
                      key={index}
                      id={item.name}
                      value={item.name}
                      control={<Radio />}
                      label={item.name}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="primary"
                onClick={this.selectRoom.bind(this)}
              >
                Join!
              </Button>
            </DialogActions>
          </TabContainer>
        )}
        {value === 1 && (
          <TabContainer>
            <DialogContent>
              <DialogContentText>
                Create a chatroom and share the name with your friends!
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="create-username"
                label="Username"
                type="text"
                fullWidth
                onKeyPress={this.handleKeyPress.bind(this)}
              />
              <TextField
                autoFocus
                margin="dense"
                id="chatroomCreateName"
                label="Chatroom Name"
                type="text"
                fullWidth
                onKeyPress={this.handleKeyPress.bind(this)}
              />
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="primary"
                onClick={this.createRoom.bind(this)}
              >
                Create
              </Button>
            </DialogActions>
          </TabContainer>
        )}
      </Dialog>
    );
  }
}

function select({ app, users, messages, thisUser }) {
  return { app, users, messages, thisUser };
}

export default connect(select)(Login);
