const gamePlay = {
  key: "gamePlay",
  preload: function () {
    this.load.image("bg2", "img/gameplay-bg.png");
    this.load.image("build3", "img/build3.png");
    this.load.image("build2", "img/build2.png");
    this.load.image("build1", "img/build1.png");
    this.load.image("footer", "img/footer.png");
    this.load.spritesheet("player", "img/player.png", { frameWidth: 580, frameHeight: 630 });
    this.load.image("btnRight", "img/btn-right.png");
    this.load.image("btnLeft", "img/btn-left.png");
    this.load.image("topbar1", "img/topbar1.png");
    this.load.image("topbar2", "img/topbar2.png");
    this.load.image("topbar3", "img/topbar3.png");
    this.load.image("gift1", "img/gift1.png");
    this.load.image("gift2", "img/gift2.png");
    this.load.image("bomb", "img/bomb.png");

    this.gameStop = false; // 控制遊戲是否停止
    this.lifeStep = 3; // 生命
    this.timeStep = 30; // 遊戲時間
    this.pointStep = 0; // 遊戲分數
  },
  create: function () {
    this.add.image(cw / 2, ch / 2, "bg2");
    this.build3 = this.add.tileSprite(cw / 2, ch / 2, 768, 1024, "build3");
    this.build2 = this.add.tileSprite(cw / 2, ch / 2, 768, 1024, "build2");
    this.build1 = this.add.tileSprite(cw / 2, ch / 2, 1000, 1024, "build1");
    this.rectTop = this.add.rectangle(384, 30, 768, 60);
    this.footer = this.add.tileSprite(cw / 2, ch - 136, 1000, 273, "footer");
    this.btnRight = this.add.image(cw - 200, ch - 100, "btnRight").setInteractive();
    this.btnLeft = this.add.image(200, ch - 100, "btnLeft").setInteractive();
    this.add.image(130, 50, "topbar1");
    this.add.image(380, 50, "topbar2");
    this.add.image(630, 50, "topbar3");

    // 文字
    this.lifeText = this.add.text(130, 30, this.lifeStep, { fontSize: "40px", fill: "#FFFFFF", fontFamily: "Microsoft JhengHei" });
    this.timeText = this.add.text(370, 30, this.timeStep, { fontSize: "40px", fill: "#FFFFFF", fontFamily: "Microsoft JhengHei" });
    this.pointText = this.add.text(620, 30, this.pointStep, { fontSize: "40px", fill: "#FFFFFF", fontFamily: "Microsoft JhengHei" });
    // 遊戲計時器
    let _this = this;
    let gametime = setInterval(() => {
      this.timeStep--;
      this.timeText.setText(this.timeStep);
      if (this.timeStep <= 0) {
        clearInterval(gametime);
        gameOver(_this);
      }
    }, 1000);

    // 加入物理效果
    const addPhysics = (GameObject) => {
      this.physics.add.existing(GameObject);
      GameObject.body.immovable = true; //設定物件不會動靜止不會掉下去
      GameObject.body.moves = false; //物件的位置和旋轉是否受其速度，加速度，阻力和重力的影響
    };

    addPhysics(this.footer);
    addPhysics(this.rectTop);

    // 設定人物位置 sprite 是單一物件，不會重覆所以不用tileSprite
    this.player = this.physics.add.sprite(100, 200, "player").setScale(0.4);
    this.player.setCollideWorldBounds(true); //角色邊界設定

    // 設定角色彈跳值
    this.player.setBounce(1);

    // 設定角色碰撞邊界(正常會小一點)
    this.player.setSize(320, 360, 0).setOffset(130, 140, true);

    // player animate
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("player", { start: 3, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "stop",
      frames: [{ key: "player", frame: 2 }],
      frameRate: 20,
    });
    this.player.anims.play("run", true);

    // touch control
    this.goRight = false;
    this.gotLeft = false;

    this.btnRight.on("pointerdown", () => (this.goRight = true));
    this.btnRight.on("pointerup", () => (this.goRight = false));
    this.btnRight.on("pointerout", () => (this.goRight = false));
    this.btnLeft.on("pointerdown", () => (this.goLeft = true));
    this.btnLeft.on("pointerup", () => (this.goLeft = false));
    this.btnLeft.on("pointerout", () => (this.goLeft = false));

    // gifts
    this.gifts = this.physics.add.group();

    const giftsYPos = [230, 430, 630];
    const giftsStyle = ["gift1", "gift2"];

    this.giftCreatTimer = setInterval(() => {
      for (let i = 0; i < 3; i++) {
        if (getRandom(1, 0) === 1) continue;
        let el = this.gifts.create(850, giftsYPos[i], giftsStyle[getRandom(1, 0)]);
        addPhysics(el);
      }
    }, 800);

    // bombs
    this.bombs = this.physics.add.group();

    this.bombCreatTimer = setInterval(() => {
      if (this.timeStep <= 24) {
        let el = this.bombs.create(cw + 200, Phaser.Math.Between(120, 450), "bomb");
        el.setSize(55, 65, 0).setOffset(10, 30, true).setBounce(1).setVelocity(-250, -50);
        this.physics.add.collider(el, this.rectTop);
        this.physics.add.collider(el, this.footer);
        this.physics.add.overlap(this.player, el, collectBomb, null, this);
      }
    }, 3500);

    // 綁定碰撞
    this.physics.add.collider(this.player, this.footer);
    this.physics.add.overlap(this.player, this.gifts, collectGift, null, this);

    function collectBomb(player, item) {
      this.tweens.add({ targets: player, duration: 80, alpha: 0, yoyo: true, repeat: 1 });
      this.lifeStep--;
      this.lifeText.setText(this.lifeStep);
      item.destroy();
      if (this.lifeStep < 1) {
        clearInterval(gametime);
        gameOver(_this);
      }
    }
    this.input.addPointer(2);

    const againButtons = document.querySelectorAll(".btn-again");
    againButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        gameAgain(_this);
      });
    });

    // btn-pdlink 僅作為示意，防止點擊跳轉
    const pdlinkButtons = document.querySelectorAll(".btn-pdlink");
    pdlinkButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        // 獎品連結
      });
    });
  },

  update: function () {
    if (this.gameStop) return;
    // bgmove
    this.footer.tilePositionX += 3;
    this.build1.tilePositionX += 2;
    this.build2.tilePositionX += 1.5;
    this.build3.tilePositionX += 1;

    this.gifts.getChildren().forEach((el) => {
      el.x -= 5;
      el.x < 0 && el.destroy();
    });

    this.bombs.getChildren().forEach((el) => {
      el.x < 0 && el.destroy();
    });

    // keyboard & touch control
    const keyboard = this.input.keyboard.createCursorKeys(); //使用一般的上下左右space shift
    if (keyboard.right.isDown || this.goRight) {
      this.player.anims.play("fly", true);
      this.player.flipX = false;
      this.player.setVelocityX(600);
      this.btnRight.y = ch - 90;
    } else if (keyboard.left.isDown || this.goLeft) {
      this.player.anims.play("fly", true);
      this.player.flipX = true;
      this.player.setVelocityX(-600);
      this.btnLeft.y = ch - 90;
    } else {
      //放開時，init 原始狀態
      this.player.anims.play("run", true);
      this.player.flipX = false;
      this.player.setVelocityX(0);
      this.btnRight.y = ch - 100;
      this.btnLeft.y = ch - 100;
    }
  },
};

function collectGift(player, item) {
  this.pointStep += 10;
  this.pointText.setText(this.pointStep);
  item.destroy();
}

// game stop
function gameOver(_this) {
  _this.gameStop = true;
  _this.player.play("stop").setBounce(0.5).setVelocity(0, 0);
  _this.player.flipX = false;
  clearInterval(_this.giftCreatTimer);
  clearInterval(_this.bombCreatTimer);
  _this.bombs.getChildren().forEach((el) => {
    el.destroy();
  });
  if (_this.lifeStep === 0 || _this.pointStep <= 300) {
    setTimeout(() => {
      openModal(document.querySelector("#gamelose"));
    }, 1000);
  } else {
    setTimeout(() => {
      openModal(document.querySelector("#gamesuccess"));
    }, 1000);
  }
}

function gameAgain(_this) {
  document.querySelectorAll(".modal.is-open").forEach((modal) => {
    closeModal(modal);
  });
  _this.scene.start("gameStart");
}

// $('#gamesuccess').modal({ backdrop: 'static', show: true })
