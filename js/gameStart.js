const gameStart = {
  key: "gameStart",
  preload: function () {
    this.load.image("bg1", "img/gamestart-bg.png");
    this.load.image("header1", "img/header-1.png");
    this.load.image("header2", "img/header-2.png");
    this.load.image("steak", "img/steak.png");
    this.load.image("cookieman", "img/cookieman.png");
    this.load.image("btnStart", "img/btn-start.png");
    this.load.image("btnRemind", "img/btn-remind.png");
    this.load.image("ios", "img/ios.png");
    this.load.image("android", "img/android.png");
  },
  create: function () {
    this.bg1 = this.add.image(cw / 2, ch / 2, "bg1");
    let btnStart = this.add
      .image(200, cw - 100, "btnStart")
      .setScale(0)
      .setInteractive();
    let btnRemind = this.add
      .image(570, cw - 110, "btnRemind")
      .setScale(0)
      .setInteractive();
    this.cookieman = this.add.image(80, 330, "cookieman");
    this.header1 = this.add.image(cw / 2 - 20, 330, "header1");
    this.steak = this.add.image(840, 100, "steak");
    this.header2 = this.add.image(520, 330, "header2").setOrigin(0, 0);
    let ios = this.add.image(360, ch - 60, "ios").setInteractive();
    let android = this.add.image(620, ch - 60, "android").setInteractive();

    // banner animation
    let tl = this.tweens.createTimeline();
    tl.add({
      targets: this.steak,
      delay: 500,
      duration: 1000,
      x: 690,
      y: 310,
      ease: "Elastic",
      easeParams: [1, 0.3],
    })
      .add({
        targets: this.header2,
        duration: 150,
        x: 500,
        y: 340,
        angle: 10,
        yoyo: true,
        offset: 600,
      })
      .add({
        targets: btnStart,
        duration: 1200,
        scale: 1,
        ease: "Elastic",
        easeParams: [1, 0.5],
        offset: 600,
      })
      .add({
        targets: btnRemind,
        duration: 1200,
        scale: 1,
        ease: "Elastic",
        easeParams: [1, 0.5],
        offset: 800,
      })
      .add({
        targets: this.cookieman,
        duration: 1000,
        angle: 10,
        repeat: -1,
        yoyo: true,
        offset: 0,
      });
    tl.play();

    // btn controler
    btnStart.on("pointerdown", () => this.scene.start("gamePlay"));
    btnRemind.on("pointerdown", () => openModal(document.querySelector("#remind")));
    ios.on("pointerdown", () => (location.href = ""));
    android.on("pointerdown", () => (location.href = ""));
  },
  update: function () {},
};
