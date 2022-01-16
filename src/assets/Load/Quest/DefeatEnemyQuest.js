function register(quest_switcher, Quest) {
  class DefeatEnemyQuest extends Quest {
    constructor({ partyHandler }) {
      super()
      this.name = "Defeated Enemy";
      this.description_text = "Defeat 10 enemies";
      this.enemies_defeated = 0;
      this.ENEMY_TARGET = 10;
      this.enemy_defeat_subscription = partyHandler.onBattleEnded().subscribe(([status, enemy_formation]) => {
        if (status !== "victory")
          return;
        for (const enemy of enemy_formation) {
          if (enemy.enemy_type === 'enemyTest')
            this.enemies_defeated = Math.min(this.enemies_defeated, this.ENEMY_TARGET);
        }
        this.remove_subscriptions();
      });
    }
    toJson() {
      return {
        Factory: 'Quest',
        type: "DefeatEnemyQuest",
        enemies_defeated: this.enemies_defeated
      };
    }
    fromJson(options) {
      this.enemies_defeated = options.enemies_defeated;
      this.remove_subscriptions();
    }
    remove_subscriptions() {
      if (this.enemies_defeated === this.ENEMY_TARGET)
        this.enemy_defeat_subscription && this.enemy_defeat_subscription.unsubscribe();
    }
    get add_description() {
      return [{
        name: "condition",
        section_items: [{
          name: "enemies_defeated",
          value: `${this.enemies_defeated} / ${this.ENEMY_TARGET}`
        }]
      }];
    }
  }
  quest_switcher["DefeatEnemyQuest"] = DefeatEnemyQuest;
}
module.exports = { register };
