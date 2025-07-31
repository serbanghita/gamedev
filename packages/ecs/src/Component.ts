export default class Component<T extends NonNullable<object>> {
  public bitmask?: bigint;

  constructor(public properties: T) {}

  // Lazy init / Re-init.
  init(properties: T) {
      this.properties = properties;
  }

  // Use this when saving the state.
  serialize(): NonNullable<object> {
    return this.properties;
  }
}
