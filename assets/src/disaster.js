var Disasters = function(main, group) {
	this.main = main;
	this.game = main.game;
	this.group = group;
	this.board = main.getBoard();
	//this.damCount = main.board.getDamCount();
	//this.beavers = main.beavers;
	//this.board.getDams() = main.board.dams;

	var disasters = [["Poacher", "Hunters looking for beaver furs swing through, killing some number of your beavers", 0.05],
					 ["Pollution", "The polluted waters mutate your beavers' genes. Lose one evolution trait.", 0.1],
					 ["Lumberjack", "The forest has been leveled. There are no trees left to build with for two generations.", 0.15],
					 ["Forest Fire", "The land is scorched with a wild fire. No land based dam spaces survived the blaze.", 0.2],
					 ["Flash Flood", "The river becomes swollen, washing away all water based dam spaces", 0.2],
					 ["Drought", "The river runs dry, causing a chain effect that leads to starvation of half of your beavers", 0.15],
					 ["Famine", "The shrubs and grass your beavers subsist on do not grow. Half of your population dies and repopulation is impossible for one turn", 0.1],
					 ["Tornado", "A massive tornado whips through, destroying half of your dam and killing half of your population", 0.05]];
	this.map = ["Poacher", 
				"Pollution", "Pollution", 
				"Lumberjack", "Lumberjack", "Lumberjack", 
				"Forest Fire", "Forest Fire", "Forest Fire", "Forest Fire",
				"Flash Flood", "Flash Flood", "Flash Flood", "Flash Flood",
				"Drought", "Drought", "Drought", 
				"Famine", "Famine", 
				"Tornado"];

	this.createDisasters(disasters);
	this.hide();
};

Disasters.prototype = {
	createDisasters: function(disasters) {
		// Use this line to quickly cause disasters
		// selectDisaster = this.group.add(new Phaser.Button(this.game, 400, 15, 'select', this.occurrence, this));

		this.hide();
		for (var index = 0; index < disasters.length; index++) {
			this.group.add(new Phaser.Text(this.game, 50, (index * 50) + 50, disasters[index][0], { fill: "black", font: "16px Arial" }));
			this.group.add(new Phaser.Text(this.game, 100, (index * 50) + 70, disasters[index][1], { fill: "black", font: "12px Arial", wordWrap: true, wordWrapWidth: 700 }));
			this.group.add(new Phaser.Text(this.game, 400, (index * 50) + 50, disasters[index][2], { fill: "black", font: "12px Arial" }));
			//Should make each disaster its own group and then only show based on what disasters could occur
		}
	},

	getGroup: function() {
		return this.group;
	},

	show: function() {
		this.group.visible = true;
	},

	hide: function() {
		this.group.visible = false;
	},

	next: function() {
		this.hide();
		this.board.show();
	},
	
	occurrence: function() {
		var disaster;

		if (this.getRandomInt(0,1) == 0) {
			disaster = "No disaster";
			console.log("No disaster");
		}
		else {
			var random = this.getRandomInt(0, 19);
			var result = this.map[random];
			disaster = result;
			console.log(result);
			this.consequences(result);
		}
		return disaster;
	},

	consequences: function(result) {
		switch(result) {
			case "Drought":
				var pct = 0.5;
				if (this.main.getEvolutionCard().getTrait(1,2)) {
					pct = 0.75;
				}
				this.main.setBeavers(Math.floor(this.main.getBeavers() * pct));
				this.main.updateBeaverCount();
				break;
			case "Famine":
				if (!this.main.getEvolutionCard().getTrait(0,2)) {
					this.main.setBeavers(Math.floor(this.main.getBeavers() / 2));
					this.main.updateBeaverCount();
				}
				this.main.getBoard().decrementPopulateCounter();
				break;
			case "Tornado":
				var pct = 0.5;
				if (this.main.getEvolutionCard().getTrait(1,1)) {
					pct = 0.25;
				}
				this.main.setBeavers(Math.floor(this.main.getBeavers() * (1-pct)));
				this.main.updateBeaverCount();
				// Currently just going to destroy the first half of the dams in the array
				var dams = this.board.getDams();
				var toDestroy = Math.floor(dams.length * pct);
				for (var dam = 0; dam < toDestroy; dam++){
					this.board.removeDam(dams[dam]);	
				}
				this.main.updateBeaverCount();
				this.main.updateDamCount();
				break;
			case "Lumberjack":
				if (!this.main.getEvolutionCard().getTrait(0,1)){
					this.main.getBoard().decrementBuildCounter();
				}
				this.main.getBoard().decrementBuildCounter();
				break;
			case "Pollution":
				// iterate through traits, remove the first highest one we see
				var devolved = false;
				for (var trait = 2; trait >=0; trait--){
					for (var category = 0; category <= 2; category++){
						if (this.main.getEvolutionCard().getTrait(category,trait)) {
							this.main.getEvolutionCard().devolveTrait(category,trait);
							devolved=true;
							break;
						}
					}
					if (devolved) break;
				}
				break;
			case "Poachers":
				var random = this.getRandomInt(0, 9);
				if (this.main.getEvolutionCard().getTrait(1,0)) {
					random *= 0.5;
				}
				this.main.setBeavers(this.main.getBeavers() - random);
				this.main.updateBeaverCount();
				break;
			case "Forest Fire":
				var pct = 1;
				if (this.main.getEvolutionCard().getTrait(2,0)) {
					pct = 0.5;
				}
				var landDams = this.board.getDamsOfType("land");

				// Destroying the first half of land dams that I get
				var toDestroy = Math.floor(landDams.length * pct);
				landDams.splice(toDestroy, landDams.length);
				for (dam in landDams) {
					var piece = landDams[dam];
					this.board.removeDam(piece);
				}
				this.main.updateDamCount();
				break;
			case "Flash Flood":
				var pct = 1;
				if (this.main.getEvolutionCard().getTrait(2,0)) {
					pct = 0.5;
				}
				var waterDams = this.board.getDamsOfType("water");
				var toDestroy = Math.floor(waterDams.length * pct);
				waterDams.splice(toDestroy, waterDams.length);
				for (dam in waterDams) {
					var piece = waterDams[dam];
					this.board.removeDam(piece);
				}
				this.main.updateDamCount();
				break;
		}		
	},

	getRandomInt: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}