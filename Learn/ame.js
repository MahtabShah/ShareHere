const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 700,
  backgroundColor: "#fff",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

let playerA, playerB;
let arrows;
let obstacles = [];

function preload() {}

function create() {
  // Players
  playerA = this.add.rectangle(200, 40, 40, 40, 0xff0000);
  playerB = this.add.rectangle(200, 660, 40, 40, 0x0000ff);
  this.physics.add.existing(playerA);
  this.physics.add.existing(playerB);

  // Arrow group
  arrows = this.physics.add.group();

  // Obstacles
  const obsY = [220, 320, 420];
  obsY.forEach((y, i) => {
    let obs = this.add.rectangle(0, y, 100, 10, 0x888888);
    this.physics.add.existing(obs);
    obs.body.velocity.x = (i % 2 === 0 ? 100 : -100);
    obs.body.setImmovable(true);
    obstacles.push(obs);
  });

  // Controls
  this.input.keyboard.on("keydown-W", () => {
    fireArrow(this, playerA, 200);
  });
  this.input.keyboard.on("keydown-ARROWDOWN", () => {
    fireArrow(this, playerB, -200);
  });
}

function update() {
  // Move obstacles back and forth
  obstacles.forEach(obs => {
    if (obs.x <= 0 || obs.x + obs.width >= 400) {
      obs.body.velocity.x *= -1;
    }
  });

  // Remove offscreen arrows
  arrows.getChildren().forEach(arrow => {
    if (arrow.y < 0 || arrow.y > 700) {
      arrow.destroy();
    }
  });

  // Collision detection
  this.physics.world.overlap(arrows, playerA, () => {
    alert("Player B wins!");
    arrows.clear(true, true);
  });

  this.physics.world.overlap(arrows, playerB, () => {
    alert("Player A wins!");
    arrows.clear(true, true);
  });

  obstacles.forEach(obs => {
    this.physics.world.collide(arrows, obs, (arrow) => {
      arrow.destroy();
    });
  });
}

function fireArrow(scene, player, velocity) {
  const arrow = scene.add.rectangle(player.x, player.y + (velocity > 0 ? 20 : -20), 5, 15, 0x000000);
  scene.physics.add.existing(arrow);
  arrow.body.velocity.y = velocity;
  arrows.add(arrow);
}
