type PropertiesOptions = {
    [key: string]: string | number | unknown;
}

export function extend<T extends PropertiesOptions , U extends Partial<PropertiesOptions>>(props: T, newProps: U) {
    if (!newProps) {
        return props;
    }

    return { ...props, ...newProps};
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function roundWithTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}