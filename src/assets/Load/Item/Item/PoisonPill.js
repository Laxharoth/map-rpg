const register = (ItemSwitcher, { GameItem }, Factory) => {
  const StatusFactory = Factory;
  class PoisonPill extends GameItem {
      get name() { return 'Poison Pill'; }
      get isMapUsable() { return false; }
      get isPartyUsable() { return false; }
      _itemEffect(user, target) {
          const poison = StatusFactory(this.masterService, { Factory: "Status", type: "Poison" });
          //@ts-ignore
          poison.DURATION = 1;
          return target.addStatus(poison);
      }
  }
  ItemSwitcher['Poison Pill'] = PoisonPill;
};
const module_name = 'Poison Pill'
const module_dependency = ['Poison']
module.exports = { register, module_name, module_dependency};
