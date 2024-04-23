import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { requestPattern } from '../actions';
import Button from "@material-ui/core/Button/Button";
import { logout } from "../actions";
import { MenuItem, Select, FormControl, InputLabel, Typography, Container } from '@material-ui/core';


//data for patterns
const patterns = [
  { id: 1, name: 'Pattern 1', data: "(0,0),(1,1),(2,2)" },
  { id: 2, name: 'Pattern 2', data: "(1,2),(3,5),(5,8)" },
  { id: 3, name: 'Pattern 3', data: "(0,1),(1,0),(2,1),(2,0)" },
  { id: 4, name: 'Pattern 4', data: "(2,2),(2,3),(3,2),(3,3)" },
  { id: 5, name: 'Pattern 5', data: "(0,0),(0,2),(2,0),(2,2)" }
];


class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPatternId: ''
    };
  }

  handleChange = (event) => {
    this.setState({ selectedPatternId: event.target.value }, () => {
      const pattern = patterns.find(p => p.id === parseInt(this.state.selectedPatternId));
      this.props.requestPattern(pattern);
    });
  };

  renderPatternSelector() {
    return (
      <FormControl fullWidth>
        <InputLabel id="pattern-selector-label">Select Pattern</InputLabel>
        <Select
          labelId="pattern-selector-label"
          value={this.state.selectedPatternId}
          onChange={this.handleChange}
          displayEmpty
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {patterns.map((pattern) => (
            <MenuItem key={pattern.id} value={pattern.id}>{pattern.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  render() {
    const { currentPattern } = this.props;

    return (
      <Container>
        <Typography variant="h4" style={{ textAlign: 'center', margin: '20px 0' }}>
          Pattern Room
        </Typography>
        <div>{this.renderPatternSelector()}</div>
        {currentPattern && (
          <Typography variant="subtitle1" style={{ marginTop: '20px', textAlign: 'center' }}>
            Current Pattern: {currentPattern.data}
          </Typography>
        )}
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  currentPattern: state.patterns.currentPattern
});

const mapDispatchToProps = {
  requestPattern
};

export default connect(mapStateToProps, mapDispatchToProps)(Room);
