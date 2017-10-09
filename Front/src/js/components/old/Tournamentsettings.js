import React from "react";
import {connect} from "react-redux";

export default class Tournamentsettings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            raceTo: this.props.raceTo,
            sizeoptions: []
        };
        this.initCupSize = this.initCupSize.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    initCupSize() {
        var size = this.props.tournamentSize;
        var options = [];
        while (size > 4) {
            size = size / 2;
            options.push(
                <option key={size} value={size}>{size}</option>
            )
        }
        options.reverse();
        this.state.sizeoptions = options;
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        var raceTo = this.state.raceTo;
        raceTo = {...raceTo, [name]:value};
        this.setState({raceTo: raceTo});
        this.props.setRaceTo(raceTo);
    }

    handleSelectChange(event) {
      this.props.setCupSize(event.target.value);
    }

    render() {
        const type = this.props.tournamentType;
        this.initCupSize();
        if (type === 'League') {
            return (
                <div className="options">
                    <div className="inline-block settings">
                        <div className="lunaux-margin-bottom">
                            <label>Round-robin stage, race to</label><input className="numberfield" name="roundrobin" value={this.state.raceTo.roundrobin} onChange={this.handleInputChange} type="number" min="1"/>
                        </div>
                        <div className="lunaux-margin-bottom">
                            <label>Double-elimination stage, race to</label><input className="numberfield" name="double" value={this.state.raceTo.double} onChange={this.handleInputChange} type="number" min="1"/>
                        </div>
                        <div className="lunaux-margin-bottom">
                            <label>Single-elimination stage, race to</label><input className="numberfield" name="single" value={this.state.raceTo.single}  onChange={this.handleInputChange} type="number" min="1"/>
                        </div>
                        <div className="lunaux-margin-bottom">
                            <label>Players in cup</label>
                              <select value={this.props.cupSize} onChange={this.handleSelectChange}>
                                  {this.state.sizeoptions}
                              </select>
                        </div>
                    </div>
                </div>
            );
        } else if (type === 'DoubleWithCup') {
            return (
                <div className="options">
                    <div className="inline-block settings">
                        <div className="lunaux-margin-bottom">
                            <label>Double-elimination stage, race to</label><input className="numberfield" name="double" value={this.state.raceTo.double} onChange={this.handleInputChange} type="number" min="1"/></div>
                        <div className="lunaux-margin-bottom">
                            <label>Single-elimination stage, race to</label><input className="numberfield" name="single" value={this.state.raceTo.single} onChange={this.handleInputChange} type="number" min="1"/></div>
                        <div className="lunaux-margin-bottom">
                            <label>Players in cup</label>
                            <select value={this.props.cupSize} onChange={this.handleSelectChange}>
                                {this.state.sizeoptions}
                            </select>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="options">
                    <div className="inline-block settings">
                        <div className="lunaux-margin-bottom">
                            <label>Race to</label><input className="numberfield" name="single" type="number" value={this.state.raceTo.single} onChange={this.handleInputChange} min="1"/></div>
                    </div>
                </div>
            );
        }
    }
}
