var App = React.createClass({displayName: "App",
	setNumber(i, e) {
		var monsters = this.state.monsters;
		monsters[i].number = e.target.value;
		this.setState({
			monsters: monsters
		});
	},
	setPower(i, e) {
		var monsters = this.state.monsters;
		monsters[i].power = e.target.value;
		this.setState({
			monsters: monsters
		});
	},
	setAttacks(i, e) {
		var monsters = this.state.monsters;
		monsters[i].attacks = e.target.value;
		this.setState({
			monsters: monsters
		});
	},
	addMonster() {
		var monsters = this.state.monsters;
		monsters.push({
		    number: 1,
    		power: 1,
    		attacks: 1
		})
		this.setState({
			monsters: monsters,
			canDeleteRow: true
		})
	},
	deleteMonster(i) {
		var monsters = this.state.monsters;
		var canDeleteRow = this.state.canDeleteRow;
		monsters.splice(i, 1);
		if (monsters.length === 1)
			canDeleteRow = false;
		this.setState({
			monsters: monsters,
			canDeleteRow: canDeleteRow
		})
	},
	getTotalDamage() {
		var totalDamage = 0;
		this.state.monsters.forEach(function(monster){
			totalDamage += monster.power * monster.attacks * monster.number;
		});
		return totalDamage;
	},
	getInitialState() {
	    return {
	        monsters: [
	        	{
	        		number: 1,
	        		power: 1,
	        		attacks: 1
	        	}
	        ],
	        canDeleteRow: false
	    };
	},
	render() {
		return (
			React.createElement("div", null, 
				React.createElement("div", {className: "header"}, "Dangerocity — mob damage per turn calculator"), 
				React.createElement("table", {className: "monsters"}, 
					React.createElement("tbody", null, 
						React.createElement("tr", {className: "monsters__title"}, 
							React.createElement("td", {className: "monsters__title-td", colSpan: "2"}, "Number"), 
							React.createElement("td", {className: "monsters__title-td", colSpan: "3"}, "Damage"), 
							React.createElement("td", {className: "monsters__title-td", colSpan: "2"}, "Attacks")
						), 
						this.state.monsters.map(function(monster, i){
							return React.createElement(Monster, React.__spread({},  
								monster, 
								{i: i, 
								key: i, 
								canDeleteRow: this.state.canDeleteRow, 
								setNumber: this.setNumber, 
								setPower: this.setPower, 
								setAttacks: this.setAttacks, 
								deleteMonster: this.deleteMonster}))
						}, this)
					)
				), 
				React.createElement("button", {className: "add-monster", onClick: this.addMonster}, "Add Monster"), 
				React.createElement("div", {className: "total"}, "Total raw damage: ", this.getTotalDamage())
			)
		);
	}
})

var Monster = React.createClass({displayName: "Monster",
	getDices() {
		if (parseInt(this.props.power) < 6) {
			switch (parseInt(this.props.power)) {
				case 1:
					return '1d4-1';
				case 2: 
					return '1d4';
				case 3: 
					return '1d6';
				case 4:
					return '1d6+1';
				case 5:
					return '1d6+2';
			}
			console.log(output);
			return output;
		} else {
			var diceValues = [6.5, 5.5, 4.5, 3.5, 2.5];
			var diceTitles = ['d12', 'd10', 'd8', 'd6', 'd4'];
			var getDiceIndex = function(power) {
				var diceRemainders = [];
				var diceResults = [];
				diceValues.forEach(function(dice){
					diceRemainders.push(power%dice);
					diceResults.push(power/dice);
				})
				var diceIndex = -1;
				if (diceRemainders.indexOf(0) !== -1) {
					diceIndex = diceRemainders.indexOf(0);
					return {
						diceResult: diceResults[diceIndex],
						diceIndex: diceIndex
					}
				} else 
					return -1
			}
			var getDiceString = function(dice, str) {
				return dice.diceResult + diceTitles[dice.diceIndex] + '+' + str;
			}
			var totalPower = this.props.power;
			var strBonus = Math.round(totalPower/3);
			var diceResults = [getDiceIndex(totalPower - strBonus), 
				getDiceIndex(totalPower - strBonus + 1), 
				getDiceIndex(totalPower - strBonus - 1),
				getDiceIndex(totalPower - strBonus + 2),
				getDiceIndex(totalPower - strBonus - 2)];
			var diceResultsIndex = 0;
			var diceResultsLowestDice = 99;
			diceResults.forEach(function(diceResult, i){
				if (diceResult !== -1 && diceResult.diceResult < diceResultsLowestDice) {
					diceResultsIndex = i;
					diceResultsLowestDice = diceResult.diceResult;
				}
			})
			switch (diceResultsIndex) {
				case 0:
					break;
				case 1:
					strBonus -= 1;
					break;
				case 2:
					strBonus += 1;
					break;
				case 3:
					strBonus -= 2;
					break;
				case 4:
					strBonus += 2;
					break;
				default:
					console.log('...' + diceResultsIndex)
					break;
			}
			return getDiceString(diceResults[diceResultsIndex], strBonus)
		}
	},
	render() {
		var delButton = null;
		if (this.props.canDeleteRow === true) {
			delButton =	React.createElement("svg", {className: "monster__delete", onClick: this.props.deleteMonster.bind(null, this.props.i)}, 
					React.createElement("path", {d: "M10.3846154,9 L18,1.38461538 L16.6153846,-1.16020857e-14 L9,7.61538462 L1.38461538,-1.42108547e-14 L-1.42480322e-14,1.38461538 L7.61538462,9 L-1.59872116e-14,16.6153846 L1.38461538,18 L9,10.3846154 L16.6153846,18 L18,16.6153846 L10.3846154,9 L10.3846154,9 L10.3846154,9 Z"})
				)
		}
		return (
			React.createElement("tr", {className: "monster"}, 
				React.createElement("td", {className: "monster__td"}, 
					React.createElement("input", {className: "monster__number-input", onChange: this.props.setNumber.bind(null, this.props.i), type: "range", value: this.props.number, min: "1", max: "8"})
				), 
				React.createElement("td", {className: "monster__td monster__number"}, this.props.number), 
				React.createElement("td", {className: "monster__td"}, 
					React.createElement("input", {className: "monster__power-input", onChange: this.props.setPower.bind(null, this.props.i), type: "range", value: this.props.power, min: "1", max: "40"})
				), 
				React.createElement("td", {className: "monster__td monster__power-number"}, this.props.power), 
				React.createElement("td", {className: "monster__td monster__power-dice"}, this.getDices()), 
				React.createElement("td", {className: "monster__td"}, 
					React.createElement("input", {className: "monster__attacks-input", onChange: this.props.setAttacks.bind(null, this.props.i), type: "range", value: this.props.attacks, min: "1", max: "8"})
				), 
				React.createElement("td", {className: "monster__td monster__attacks"}, this.props.attacks), 
				React.createElement("td", {className: "monster__td"}, 
					delButton
				)
			)
		)
	}
})

React.render(React.createElement(App), document.getElementById('react'));